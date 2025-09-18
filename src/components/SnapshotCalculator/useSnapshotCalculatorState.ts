import { useState, useEffect } from "react";

const DEFAULTS = {
  tests: 50,
  builds: 1,
  browsers: 1,
  viewports: 1,
  accessibility: false,
  turboSnap: false,
  changedTestsPercentage: 50,
};

export function useSnapshotCalculatorState() {
  const [_, setQueryParamsState] = useState(() => new URLSearchParams(""));

  const [tests, setTests] = useState(DEFAULTS.tests);
  const [builds, setBuilds] = useState(DEFAULTS.builds);
  const [browsers, setBrowsers] = useState(DEFAULTS.browsers);
  const [viewports, setViewports] = useState(DEFAULTS.viewports);
  const [accessibility, setAccessibility] = useState(DEFAULTS.accessibility);
  const [turboSnap, setTurboSnap] = useState(DEFAULTS.turboSnap);
  const [changedTestsPercentage, setChangedTestsPercentage] = useState(
    DEFAULTS.changedTestsPercentage,
  );

  function setStateFromQueryParam(
    setFn: React.SetStateAction<any>,
    value: string | null,
    type: "number" | "boolean",
    fallback: any,
  ) {
    setFn(parseParam(value, type, fallback));
  }

  // Use URLSearchParams from window.location.search to set initial state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setQueryParamsState(params);

      if (params.get("tests") !== null) {
        setStateFromQueryParam(
          setTests,
          params.get("tests"),
          "number",
          DEFAULTS.tests,
        );
      }

      if (params.get("builds") !== null) {
        setStateFromQueryParam(
          setBuilds,
          params.get("builds"),
          "number",
          DEFAULTS.builds,
        );
      }

      if (params.get("builds") !== null) {
        setStateFromQueryParam(
          setBrowsers,
          params.get("browsers"),
          "number",
          DEFAULTS.browsers,
        );
      }

      if (params.get("viewports") !== null) {
        setStateFromQueryParam(
          setViewports,
          params.get("viewports"),
          "number",
          DEFAULTS.viewports,
        );
      }

      if (params.get("accessibility") !== null) {
        setStateFromQueryParam(
          setAccessibility,
          params.get("accessibility"),
          "boolean",
          DEFAULTS.accessibility,
        );
      }

      if (params.get("turboSnap") !== null) {
        setStateFromQueryParam(
          setTurboSnap,
          params.get("turboSnap"),
          "boolean",
          DEFAULTS.turboSnap,
        );
      }

      if (params.get("changedTestsPercentage") !== null) {
        setStateFromQueryParam(
          setChangedTestsPercentage,
          params.get("changedTestsPercentage"),
          "number",
          DEFAULTS.changedTestsPercentage,
        );
      }
    }
  }, []);

  useEffect(() => {
    // Helper to update query params in the URL
    function setQueryParams(params: Record<string, string>) {
      if (typeof window !== "undefined") {
        const queryParams = new URLSearchParams(params);
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${queryParams.toString()}`,
        );
        setQueryParamsState(queryParams);
      }
    }

    setQueryParams({
      tests: String(tests),
      builds: String(builds),
      browsers: String(browsers),
      viewports: String(viewports),
      accessibility: String(accessibility),
      turboSnap: String(turboSnap),
      changedTestsPercentage: String(changedTestsPercentage),
    });
  }, [
    tests,
    builds,
    browsers,
    viewports,
    accessibility,
    turboSnap,
    changedTestsPercentage,
  ]);

  return {
    tests,
    setTests,
    builds,
    setBuilds,
    browsers,
    setBrowsers,
    viewports,
    setViewports,
    accessibility,
    setAccessibility,
    turboSnap,
    setTurboSnap,
    changedTestsPercentage,
    setChangedTestsPercentage,
  };
}

// Helper to parse query param values
function parseParam(
  value: string | null,
  type: "number" | "boolean",
  fallback: any,
) {
  if (value == null) return fallback;
  if (type === "number") {
    const n = Number(value);
    return isNaN(n) ? fallback : n;
  }
  if (type === "boolean") {
    return value === "true";
  }
  return fallback;
}
