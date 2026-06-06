import { CreateRoomUseCase } from "./createRoomUseCase.ts";
import { JoinRoomUseCase } from "./joinRoomUseCase.ts";
import { LoadContinentsUseCase } from "./loadContinentsUseCase.ts";
import { RequestGamePauseUseCase } from "./requestGamePauseUseCase.ts";
import { RequestGameResumeUseCase } from "./requestGameResumeUseCase.ts";
import { StartGameUseCase } from "./startGameUseCase.ts";
import { SubmitAnswerUseCase } from "./submitAnswerUseCase.ts";

export const loadContinentsUseCase = new LoadContinentsUseCase();
export const joinRoomUseCase = new JoinRoomUseCase();
export const submitCountryNameAnswerUseCase = new SubmitAnswerUseCase();
export const startGameUseCase = new StartGameUseCase();
export const createRoomUseCase = new CreateRoomUseCase();
export const requestGamePauseUseCase = new RequestGamePauseUseCase();
export const requestGameResumeUseCase = new RequestGameResumeUseCase();
