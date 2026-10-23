// SM-2 scheduler. grade: 0=Again,1=Hard,2=Good,3=Easy -> SM-2 quality 2,3,4,5
export const DAY = 86400000;
export function newState() { return { reps: 0, ef: 2.5, interval: 0, due: 0, lapses: 0 }; }
export function review(s, grade, now = Date.now()) {
  const q = [2, 3, 4, 5][grade];
  if (q === undefined) throw new Error('bad grade');
  let { reps, ef, interval, lapses } = s;
  if (q < 3) { reps = 0; interval = 0; lapses++; }        // relearn: due again in 10 min
  else {
    reps++;
    interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(interval * ef);
    if (q === 3) interval = Math.max(1, Math.round(interval * 0.8));
    if (q === 5 && reps > 1) interval = Math.round(interval * 1.3);
  }
  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const due = interval === 0 ? now + 10 * 60000 : now + interval * DAY;
  return { reps, ef: +ef.toFixed(3), interval, due, lapses, last: now };
}
export const isMature = s => s && s.interval >= 21;
