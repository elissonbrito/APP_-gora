/** Simula latência de rede para que loading states sejam visíveis em dev. */
export function mockDelay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}
