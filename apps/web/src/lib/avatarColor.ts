const AVATAR_COLOR_VARS = [
  '--avatar-color-1',
  '--avatar-color-2',
  '--avatar-color-3',
  '--avatar-color-4',
  '--avatar-color-5',
  '--avatar-color-6',
];

/** Color determinístico por persona: la misma persona siempre saca el mismo color. */
export function getAvatarColorVar(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLOR_VARS.length;
  return `var(${AVATAR_COLOR_VARS[index]})`;
}
