export function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rem = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(rem).padStart(2, '0')}`
}
