import type { IExercise } from "./exercise";

export enum Difficulty {
  beginner = "beginner",
  intermediate = "intermediate",
  advanced = "advanced",
}

export interface IMyRoutine {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  exercises: IExercise[];
  createdAt: number;
}

export interface IRoutine {
  date: string;
  id: string;
  exercises: IExercise[];
}

export interface IAssignedRoutines {
  0?: string;
  1?: string;
  2?: string;
  3?: string;
  4?: string;
  5?: string;
  6?: string;
}
