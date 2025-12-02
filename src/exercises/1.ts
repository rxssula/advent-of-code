import { Effect, Schema, Stream } from "effect";
import { readLineFromFile } from "../lib/utils";
import { BunFileSystem } from "@effect/platform-bun";

const LineSchema = Schema.transform(
    Schema.String,
    Schema.Struct({
        char: Schema.String,
        num: Schema.Number,
    }),
    {
        strict: true,
        decode: (s) => {
            const idx = [...s].findIndex((c) => c >= "0" && c <= "9");
            return {
                char: s.slice(0, idx),
                num: Number(s.slice(idx)),
            };
        },
        encode: ({ char, num }) => `${char}${num}`,
    },
);

export const solution = Effect.gen(function* () {
    const result = yield* readLineFromFile("./src/inputs/1.txt").pipe(
        Stream.runFold({ position: 50, score: 0 }, (state, line) => {
            const parsed = Schema.decodeUnknownSync(LineSchema)(line);
            let position = state.position;
            let score = state.score;

            if (parsed.char === "R") {
                score += Math.floor((position + parsed.num) / 100);
                position = (position + parsed.num) % 100;
            } else {
                if (position === 0) {
                    score += Math.floor(parsed.num / 100);
                } else if (parsed.num >= position) {
                    score += 1 + Math.floor((parsed.num - position) / 100);
                }
                position = (((position - parsed.num) % 100) + 100) % 100;
            }

            return { position, score };
        }),
    );
    return result.score;
}).pipe(Effect.provide(BunFileSystem.layer));
