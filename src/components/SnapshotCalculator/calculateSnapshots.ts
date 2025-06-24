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
  // Validate inputs
  if (isNaN(tests) || isNaN(builds) || isNaN(browsers) || isNaN(viewports)) {
    return {
      snapshots: 0,
      turboSnaps: 0,
      billedSnapshots: 0,
    };
  }

  const baseSnapshots = tests * builds * browsers * viewports;
  const accessibilitySnapshots = accessibility ? tests * builds * viewports : 0;
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
  const regularA11ySnapshots = accessibility
    ? changedTests * builds * viewports
    : 0;
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
