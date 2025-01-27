import type { ISerie } from "@/interfaces/exercise";
import type { IProgress } from "@/interfaces/progress";

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

export { initialProgress, initialSeries };
