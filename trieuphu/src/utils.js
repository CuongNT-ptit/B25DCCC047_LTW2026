   import { PRIZES, MILESTONES } from "./data";

   export const calcPrize = (correctCount, reason) => {
     if (reason === "stop") {
       return correctCount === 0 ? 0 : PRIZES[correctCount - 1];
     }

     const passed = MILESTONES.filter((m) => m <= correctCount);
     if (passed.length === 0) return 0;
     return PRIZES[passed[passed.length - 1] - 1];
   };