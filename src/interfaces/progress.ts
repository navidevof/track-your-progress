import type { IRoutine } from "./routine";

export type TDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface IProgress {
  0: IRoutine[];
  1: IRoutine[];
  2: IRoutine[];
  3: IRoutine[];
  4: IRoutine[];
  5: IRoutine[];
  6: IRoutine[];
}
