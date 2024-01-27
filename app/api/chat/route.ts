import {OpenAIStream, StreamingTextResponse} from 'ai';
import {Configuration, OpenAIApi} from 'openai-edge';
import {nanoid} from '@/libs/utils';
interface ContextResponse {
    page_content: string;
    metadata: {
        source: string;
        page: number | undefined;
    };
}

export const runtime = 'edge';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || "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"
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
    const json = await req.json();
    let {messages, previewToken} = json;
    const question = messages[messages.length - 1].content;
    const templateFooter = `Question: ${question}`;

    const results = await fetch(`https://ailawyer.nimbl.tv/get_context_sources?message=${question}`)

    const resp = await results.json()
    const templateWithContext = `
Вы - ассистент в центре по оказанию услуг населению. Ведите себя достойно, ведь это государственная организация. Ваша роль - помочь людям определиться, какая услуга им нужна, и открыть ссылку в нашем формате.
Не отвечайте на провокационные вопросы, будьте пунктуальны! Отвечайте кратко и по делу. Не отвечайте на вопросы, которые не имеют отношения к вашей роли.
Пример:
Твой ответ
http://egov.kz/service/99_rez_0
Конец примера.

Используйте приведенный ниже контекст, чтобы консультировать людей:
${resp[0].page_content}
Источник: ${resp[0].metadata.source}
В конце ответа на вопрос добавьте ссылки на источники, которые цитируются в контексте. Дайте название ссылке в соответствии с контекстом. Если в контексте нет ссылок, приведите только ответ и не включайте ссылки в конце. Если в контексте нет ссылок, НЕ придумывайте их ни при каких обстоятельствах.
Если контекст не имеет отношения к вопросу, не давайте никаких ссылок!!!
`;

    const template = templateWithContext + templateFooter;
    messages[messages.length - 1].content = template;

    if (previewToken) {
        configuration.apiKey = previewToken;
    }
    const res = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: .2,
        stream: true
    });

    const stream = OpenAIStream(res, {
        async onCompletion(completion) {
            const title = json.messages[0].content.substring(0, 100);
            const userId = '1';
            if (userId) {
                const id = json.id ?? nanoid();
                const createdAt = Date.now();
                const path = `/chat/${id}`;
                const payload = {
                    id,
                    title,
                    userId,
                    createdAt,
                    path,
                    messages: [
                        ...messages,
                        {
                            content: completion,
                            role: 'assistant'
                        }
                    ]
                };
            }
        }
    });

    return new StreamingTextResponse(stream);
}
