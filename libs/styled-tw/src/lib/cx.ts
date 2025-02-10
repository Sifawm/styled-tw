export const cx = (...args: unknown[]) => {
  return args
    .flat()
    .filter((v) => typeof v === 'string')
    .join(' ')
    .trim();
};
