export function avrRGB(a: number, b: number): number{
  return Math.floor(Math.sqrt(((a * a) + (b * b)) / 2, 2))
}