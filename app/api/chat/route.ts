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
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
    const json = await req.json();
    let {messages, previewToken} = json;
    // const session = await auth();
    const question = messages[messages.length - 1].content;
    // if (session == null) {
    //   return new Response('Unauthorized', {
    //     status: 401
    //   })
    // }
    const templateFooter = `Question: ${question}`;
    // prompt
    const templateWithContext = `
        You are an male assistant at a human services center. Behave with dignity, because this is a government organization. Your role is to help people decide which service they want and open the link in our format.
Don't answer provocative questions, be punctual!
Example:
service: http://example.com
Use the context below to counsel people:
Отвечай на том языке, на котором тебе задали вопрос!
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
