import { TimeUnit, type IMyExercise, type ISerie } from "@/interfaces/exercise";
import type { IProgress } from "@/interfaces/progress";
import {
  Difficulty,
  type IAssignedRoutines,
  type IMyRoutine,
} from "@/interfaces/routine";

const initialProgress: IProgress = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
};

const initialSeries: ISerie[] = Array.from({ length: 3 }, () => ({
  id: Date.now() + Math.random(),
  reps: 0,
  weight: 0,
  weightUnit: "kg",
}));

const initialMyExercise: IMyExercise = {
  id: "",
  name: "",
  possibleReps: null,
  possibleRestTime: {
    value: null,
    unit: TimeUnit.MINUTES,
  },
  possibleExecutionTime: {
    value: null,
    unit: TimeUnit.MINUTES,
  },
  createdAt: Date.now(),
};

const initialMyRoutine: IMyRoutine = {
  id: "",
  name: "",
  description: "",
  difficulty: Difficulty.intermediate,
  exercises: [],
  createdAt: Date.now(),
};

const initialAssignedRoutines: IAssignedRoutines = {
  0: "",
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
};

export {
  initialProgress,
  initialSeries,
  initialMyExercise,
  initialMyRoutine,
  initialAssignedRoutines,
};
