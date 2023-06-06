export function shuffle<T>(array: T[]): T[] {
  return array
    .map<[number, T]>((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}
