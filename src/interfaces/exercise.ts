export interface ISerie {
  id: number;
  reps: number;
  weight: number;
  weightUnit: string;
}

export interface IMyExercise {
  id: string;
  name: string;
}

export interface IExercise {
  id: string;
  name: string;
  series: ISerie[];
  createdAt: number;
}
