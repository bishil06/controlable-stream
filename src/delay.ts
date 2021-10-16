export function delay(ms: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(ms), ms);
  });
}
