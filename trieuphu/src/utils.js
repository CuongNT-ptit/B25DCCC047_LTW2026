import { PRIZES, MILESTONES } from "./data";

export const calcPrize = (correctCount, reason) => {
  if (reason === "win") return PRIZES[14];
  if (reason === "stop") {
    if (correctCount === 0) return 0;
    return PRIZES[correctCount - 1];
  }
  const passed = MILESTONES.filter((m) => m <= correctCount);
  if (passed.length === 0) return 0;
  return PRIZES[passed[passed.length - 1] - 1];
};

export const makeAudience = (answer, hidden) => {
  const result = [0, 0, 0, 0];
  const wrong = [0, 1, 2, 3].filter((i) => i !== answer && !hidden.includes(i));
  let ok = false;

  while (!ok) {
    const correct = 40 + Math.floor(Math.random() * 31);
    let left = 100 - correct;
    result[answer] = correct;
    ok = true;

    for (let k = 0; k < wrong.length; k++) {
      let p = left;
      if (k < wrong.length - 1) {
        p = Math.floor(Math.random() * (left + 1));
      }
      result[wrong[k]] = p;
      left -= p;
      if (p >= correct) ok = false;
    }
  }
  return result;
};