import { Effect, pipe } from "effect";
import { solution } from "./exercises/1";
import { BunRuntime } from "@effect/platform-bun";

const program = pipe(
    solution,
    Effect.tap((score) => Effect.log(score)),
);

BunRuntime.runMain(program);
