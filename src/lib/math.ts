export const DEG_TO_RAD = Math.PI / 180;

export const clamp = (number: number, min: number, max: number) =>
  Math.max(min, Math.min(number, max));
