'use client';
import Lottie from "react-lottie";
import thinking_animation from "@/animations/animation_thinking.json";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMicrophone} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1CA42B] to-[#186895] p-24">
        <div className={"flex flex-row gap-10 -mt-20"}>
            <div className={"flex items-center justify-center rounded-full bg-black/20 w-[110px] h-[110px]"}>
                <FontAwesomeIcon className={"text-black w-[70px] h-[70px]"} icon={faMicrophone}/>
            </div>

        </div>
    </main>
  );
}
