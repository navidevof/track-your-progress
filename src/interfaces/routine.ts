import type { IExercise } from "./exercise";

export type TDifficulty = "easy" | "medium" | "hard";

export interface IMyRoutine {
  name: string;
  description: string;
  difficulty: TDifficulty;
  exercises: IExercise[];
  createdAt: number;
}

export interface IRoutine {
  date: string;
  exercises: IExercise[];
}
