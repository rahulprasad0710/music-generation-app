"use client";

import { useMusicStore } from "@/store/music.store";
import { GenerationCard2 } from "./GenerationCard2";

const AudioGeneration = () => {
    const prompts = useMusicStore((s) => s.prompts);

    return (
        <div>
            {prompts.map((p) => (
                <div key={`${p.id}-v1`}>
                    <GenerationCard2
                        version={1}
                        key={`${p.id}-v1`}
                        record={p}
                    />
                    <GenerationCard2
                        version={2}
                        key={`${p.id}-v2`}
                        record={p}
                    />
                </div>
            ))}
        </div>
    );
};

export default AudioGeneration;
