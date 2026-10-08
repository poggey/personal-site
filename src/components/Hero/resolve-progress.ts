// The intro counter reports real loading, not a timer. HeroStage reports each milestone.
export const RESOLVE_EVENT = "resolve:progress";

export const MILESTONES = {
  fonts: 40,
  compiled: 75,
  firstFrame: 100,
} as const;

export function reportProgress(value: number): void {
  window.dispatchEvent(new CustomEvent<number>(RESOLVE_EVENT, { detail: value }));
}
