export const formatTimeElapsed = (diffMs: number): string => {
  if (diffMs < 1000) {
    return `${diffMs}ms`;
  } else if (diffMs < 60000) {
    return `${Math.floor(diffMs / 1000)}s`;
  } else if (diffMs < 3600000) {
    return `${Math.floor(diffMs / 60000)}m ${Math.floor((diffMs % 60000) / 1000)}s`;
  } else {
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }
};
