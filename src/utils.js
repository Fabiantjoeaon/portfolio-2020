export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

export const sleep = time => new Promise(resolve => setTimeout(resolve, time));
