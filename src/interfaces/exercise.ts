export interface ISerie {
  id: number;
  reps: number;
  weight: number;
  weightUnit: string;
}

export enum TimeUnit {
  MINUTES = "min",
  SECONDS = "seg",
}

export interface IMyExercise {
  id: string;
  name: string;
  possibleReps?: number | null;
  possibleRestTime?: {
    value: number | null;
    unit: TimeUnit;
  };
  possibleExecutionTime?: {
    value: number | null;
    unit: TimeUnit;
  };
}

export interface IExercise extends IMyExercise {
  series: ISerie[];
  createdAt: number;
}
