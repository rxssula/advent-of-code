import { FileSystem } from "@effect/platform";
import { Effect, Stream } from "effect";

export const readLineFromFile = (filename: string) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        return fs.stream(filename).pipe(Stream.decodeText(), Stream.splitLines);
    }).pipe(Stream.unwrap);
