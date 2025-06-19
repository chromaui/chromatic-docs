import { expect, test, describe } from "vitest";
import { calculateSnapshots } from "./calculateSnapshots";

const examples = [
  {
    tests: 1,
    builds: 10,
    browsers: 1,
    viewports: 1,
    snapshots: 10,
  },
  {
    tests: 1,
    builds: 10,
    browsers: 2,
    viewports: 1,
    snapshots: 20,
  },
  {
    tests: 2,
    builds: 10,
    browsers: 1,
    viewports: 1,
    snapshots: 20,
  },
  {
    tests: 2,
    builds: 10,
    browsers: 2,
    viewports: 1,
    snapshots: 40,
  },
  {
    tests: 2,
    builds: 10,
    browsers: 2,
    viewports: 2,
    snapshots: 80,
  },
];

const turboSnapExamples = [
  {
    tests: 50,
    builds: 1,
    browsers: 1,
    viewports: 1,
    changedTests: 50,
    snapshots: 50,
    turboSnaps: 0,
    billedSnapshots: 50,
  },
  {
    tests: 50,
    builds: 1,
    browsers: 1,
    viewports: 1,
    changedTests: 10,
    snapshots: 10,
    turboSnaps: 40,
    billedSnapshots: 18,
  },
  {
    tests: 50,
    builds: 1,
    browsers: 2,
    viewports: 1,
    changedTests: 50,
    snapshots: 100,
    turboSnaps: 0,
    billedSnapshots: 100,
  },
  {
    tests: 50,
    builds: 1,
    browsers: 2,
    viewports: 1,
    changedTests: 10,
    snapshots: 20,
    turboSnaps: 80,
    billedSnapshots: 36,
  },
  {
    tests: 50,
    builds: 1,
    browsers: 2,
    viewports: 2,
    changedTests: 10,
    snapshots: 40,
    turboSnaps: 160,
    billedSnapshots: 72,
  },
];

describe("calculateSnapshots", () => {
  test("Calculates snapshots", () => {
    examples.forEach(({ tests, builds, browsers, viewports, snapshots }) => {
      expect(
        calculateSnapshots(tests, builds, browsers, viewports, false, false),
      ).toEqual({
        snapshots,
        turboSnaps: 0,
        billedSnapshots: snapshots,
      });
    });
  });

  test("Calculates snapshots with accessibility enabled", () => {
    examples.forEach(({ tests, builds, browsers, viewports, snapshots }) => {
      expect(
        calculateSnapshots(tests, builds, browsers, viewports, true, false),
      ).toEqual({
        snapshots: snapshots + tests * builds * viewports,
        turboSnaps: 0,
        billedSnapshots: snapshots + tests * builds * viewports,
      });
    });
  });

  test("Calculates snapshots with TurboSnap enabled", () => {
    turboSnapExamples.forEach(
      ({
        tests,
        builds,
        browsers,
        viewports,
        snapshots,
        turboSnaps,
        billedSnapshots,
        changedTests,
      }) => {
        expect(
          calculateSnapshots(
            tests,
            builds,
            browsers,
            viewports,
            false,
            true,
            changedTests,
          ),
        ).toEqual({
          snapshots,
          turboSnaps,
          billedSnapshots,
        });
      },
    );
  });

  test("Calculates snapshots with TurboSnap enabled", () => {
    expect(calculateSnapshots(50, 1, 2, 2, true, true, 10)).toEqual({
      billedSnapshots: 92,
      snapshots: 60,
      turboSnaps: 160,
    });
  });
});
