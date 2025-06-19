export function calculateSnapshots(
  tests: number,
  builds: number,
  browsers: number,
  viewports: number,
  accessibility: boolean,
  turboSnapEnabled: boolean,
  changedTests: number = 0,
): {
  snapshots: number;
  turboSnaps: number;
  billedSnapshots: number;
} {
  const baseSnapshots = tests * builds * browsers * viewports;
  const accessibilitySnapshots = accessibility ? baseSnapshots : 0;
  const totalSnapshots = baseSnapshots + accessibilitySnapshots;

  if (!turboSnapEnabled) {
    return {
      snapshots: totalSnapshots,
      turboSnaps: 0,
      billedSnapshots: totalSnapshots,
    };
  }

  const unchangedTests = tests - changedTests;

  const regularSnapshots = changedTests * builds * browsers * viewports;
  const regularA11ySnapshots = accessibility ? regularSnapshots : 0;
  const totalRegularSnapshots = regularSnapshots + regularA11ySnapshots;

  const turboSnaps = unchangedTests * builds * browsers * viewports;

  // Total billed snapshots is the sum of regular and turbo snapshots
  const billedSnapshots = totalRegularSnapshots + 0.2 * turboSnaps;

  return {
    snapshots: totalRegularSnapshots,
    turboSnaps,
    billedSnapshots: Math.round(billedSnapshots),
  };
}
