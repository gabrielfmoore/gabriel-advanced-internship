export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatDurationLong(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0 mins 0 secs";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins} ${mins === 1 ? "min" : "mins"} ${secs} ${secs === 1 ? "sec" : "secs"}`;
}
