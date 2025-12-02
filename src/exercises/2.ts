import { BunFileSystem } from "@effect/platform-bun";
import { Effect, Schema, Stream } from "effect";
import { readCommaSeparatedFromFile } from "../lib/utils";

const splitStringInHalf = (str: string) => {
    const middle = Math.ceil(str.length / 2);
    const firstHalf = str.slice(0, middle);
    const secondHalf = str.slice(middle);

    return [firstHalf, secondHalf];
};

const RangeSchema = Schema.transform(
    Schema.String,
    Schema.Struct({
        first: Schema.Number,
        last: Schema.Number,
    }),
    {
        strict: true,
        decode: (r) => {
            const parsed = r.split("-");

            return {
                first: Schema.decodeUnknownSync(Schema.NumberFromString)(
                    parsed[0],
                ),
                last: Schema.decodeUnknownSync(Schema.NumberFromString)(
                    parsed[1],
                ),
            };
        },
        encode: (r) => `${r.first}-${r.last}`,
    },
);

export const solution = Effect.gen(function* () {
    const result = yield* readCommaSeparatedFromFile("./src/inputs/2.txt");

    let answer = 0;

    yield* Effect.forEach(result, (range) =>
        Effect.gen(function* () {
            const parsed = Schema.decodeUnknownSync(RangeSchema)(range);

            yield* Effect.loop(parsed.first, {
                while: (state) => state <= parsed.last,
                step: (state) => state + 1,
                body: (state) => {
                    const id = Schema.encodeSync(Schema.NumberFromString)(
                        state,
                    );

                    if (id.length % 2 === 1) {
                        return Effect.void;
                    }

                    const [firstHalf, secondHalf] = splitStringInHalf(id);

                    if (firstHalf === secondHalf) {
                        answer += state;
                    }

                    return Effect.void;
                },
            });
        }),
    );

    return answer;
}).pipe(Effect.provide(BunFileSystem.layer));
