import { JoinRoomUseCase } from "./joinRoomUseCase.ts";
import { LoadContinentsUseCase } from "./loadContinentsUseCase.ts";
import { SubmitAnswerUseCase } from "./submitAnswerUseCase.ts";

export const loadContinentsUseCase = new LoadContinentsUseCase();
export const joinRoomUseCase = new JoinRoomUseCase();
export const submitCountryNameAnswerUseCase = new SubmitAnswerUseCase();
