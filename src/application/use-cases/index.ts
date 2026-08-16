import { CreateRoomUseCase } from "./createRoomUseCase.ts";
import { RequestGamePauseUseCase } from "./game-commands/requestGamePauseUseCase.ts";
import { RequestGameResumeUseCase } from "./game-commands/requestGameResumeUseCase.ts";
import { StartGameUseCase } from "./game-commands/startGameUseCase.ts";
import { SubmitAnswerUseCase } from "./game-commands/submitAnswerUseCase.ts";
import { JoinRoomUseCase } from "./joinRoomUseCase.ts";
import { LoadContinentsUseCase } from "./loadContinentsUseCase.ts";

export const loadContinentsUseCase = new LoadContinentsUseCase();
export const joinRoomUseCase = new JoinRoomUseCase();
export const submitCountryNameAnswerUseCase = new SubmitAnswerUseCase();
export const startGameUseCase = new StartGameUseCase();
export const createRoomUseCase = new CreateRoomUseCase();
export const requestGamePauseUseCase = new RequestGamePauseUseCase();
export const requestGameResumeUseCase = new RequestGameResumeUseCase();
