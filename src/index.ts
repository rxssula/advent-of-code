import { Effect, pipe } from "effect";
// import { solution } from "./exercises/1";
import { solution } from "./exercises/2";
import { BunRuntime } from "@effect/platform-bun";

const program = pipe(
    solution,
    Effect.tap((answer) => Effect.log(answer)),
);

BunRuntime.runMain(program);
