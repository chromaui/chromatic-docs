import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  spacing,
  color,
  VStack,
  minSm,
  fontWeight,
  Stat,
  typography,
  Accordion,
  fontFamily,
} from "@chromatic-com/tetra";
import { calculateSnapshots } from "./calculateSnapshots";

const Container = styled.div`
  padding: ${spacing[4]};
  border-radius: 4px 4px 0 0;
  border: 1px solid ${color.blackTr10};
  border-bottom: 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};

  ${minSm} {
    flex-direction: row;
    align-items: center;
  }

  label {
    font-weight: ${fontWeight.bold};
    min-width: 40%;
  }

  input {
    flex: 1;
    min-width: auto;
    border: 1px solid ${color.blackTr10};
    border-radius: 4px;
  }

  input[type="number"] {
    padding: ${spacing[1]};
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};

  label {
    font-weight: ${fontWeight.bold};
  }
`;

const Fieldset = styled(VStack)`
  border: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-top: 1px solid ${color.blackTr10};
  margin-left: -${spacing[4]};
  margin-right: -${spacing[4]};
`.withComponent("fieldset");

const Legend = styled.legend`
  ${typography.heading16}
  margin-bottom: ${spacing[2]};
`;

const InfoStat = styled(Stat)`
  padding: ${spacing[2]};
  background: #f8f8f8;
  border-radius: 4px;
`;

const BillingStat = styled(Stat)`
  padding: ${spacing[2]};
  background: ${color.blue100};
  border-radius: 4px;
`;

const Result = styled.div`
  border-top: 1px solid ${color.blackTr10};
  margin-left: -${spacing[4]};
  margin-right: -${spacing[4]};
  padding: ${spacing[4]} ${spacing[4]} 0;
  display: flex;
  gap: ${spacing[4]};

  > * {
    flex: 1;
  }
`;

const Formulas = styled(Accordion)`
  margin-bottom: 1.5em;

  .accordion-item {
    border-top-right-radius: 0 !important;
    border-top-left-radius: 0 !important;
  }

  && code {
    font-size: 12px;
    line-height: 1.5;
    font-family: ${fontFamily.mono};
    color: ${color.slate600};
    display: block;
    background: unset;
    padding: 0;
    border: none;
  }

  hr {
    margin: ${spacing[1]} 0;
    border-top-style: dashed;
  }
`;

export const SnapshotCalculator = () => {
  const [tests, setTests] = useState(50);
  const [builds, setBuilds] = useState(1);
  const [browsers, setBrowsers] = useState(1);
  const [viewports, setViewports] = useState(1);
  const [accessibility, setAccessibility] = useState(false);
  const [turboSnap, setTurboSnap] = useState(false);
  const [changedTests, setChangedTests] = useState(0);

  useEffect(() => {
    // Reset changed tests when turboSnap is disabled
    if (!turboSnap) {
      setChangedTests(tests);
    } else {
      // Start with all tests changed if turboSnap is enabled
      setChangedTests(Math.floor(tests / 2));
    }
  }, [turboSnap, setChangedTests]);

  const results = calculateSnapshots(
    tests,
    builds,
    browsers,
    viewports,
    accessibility,
    turboSnap,
    changedTests,
  );

  return (
    <>
      <Container>
        <VStack gap={4} marginBottom={4}>
          <Field>
            <label htmlFor="sc-tests">Test count</label>
            <input
              id="sc-tests"
              type="number"
              value={tests}
              onChange={(e) => setTests(Number(e.target.valueAsNumber))}
              min="1"
            />
          </Field>
          <Field>
            <label htmlFor="sc-builds">Builds</label>
            <input
              id="sc-builds"
              type="number"
              value={builds}
              onChange={(e) => setBuilds(Number(e.target.valueAsNumber))}
              min="1"
            />
          </Field>
          <Field>
            <label htmlFor="sc-browsers">Browsers</label>
            <input
              id="sc-browsers"
              type="number"
              value={browsers}
              onChange={(e) => setBrowsers(Number(e.target.valueAsNumber))}
              min="1"
              max="4"
            />
          </Field>
          <Field>
            <label htmlFor="sc-viewports">Viewports</label>
            <input
              id="sc-viewports"
              type="number"
              value={viewports}
              onChange={(e) => setViewports(Number(e.target.valueAsNumber))}
              min="1"
            />
          </Field>
          <Checkbox>
            <input
              id="sc-accessibility"
              type="checkbox"
              checked={accessibility}
              onChange={(e) => setAccessibility(e.target.checked)}
            />
            <label htmlFor="sc-accessibility">Accessibility tests</label>
          </Checkbox>

          <Fieldset marginTop={2} gap={2}>
            <Legend>TurboSnap</Legend>
            <Checkbox>
              <input
                id="sc-turboSnap"
                type="checkbox"
                checked={turboSnap}
                onChange={(e) => setTurboSnap(e.target.checked)}
              />
              <label htmlFor="sc-turboSnap">Enabled</label>
            </Checkbox>
            {turboSnap && (
              <>
                <Field>
                  <label htmlFor="sc-test-changed">Tests with changes</label>
                  <input
                    id="sc-test-changed"
                    type="range"
                    value={changedTests}
                    onChange={(e) =>
                      setChangedTests(Number(e.target.valueAsNumber))
                    }
                    step="1"
                    min="0"
                    max={tests}
                  />
                  <span>{changedTests}</span>
                </Field>
              </>
            )}
          </Fieldset>
        </VStack>
        <Result>
          <InfoStat
            unit={toPlural(results.snapshots, "Snapshot")}
            dimension=""
            value={results.snapshots.toLocaleString()}
            size="large"
          />
          {turboSnap && (
            <InfoStat
              unit={toPlural(results.turboSnaps, "TurboSnap")}
              dimension=""
              value={results.turboSnaps.toLocaleString()}
              size="large"
            />
          )}
          <BillingStat
            unit={toPlural(results.billedSnapshots, "Billed snapshot")}
            dimension=""
            value={results.billedSnapshots.toLocaleString()}
            size="large"
          />
        </Result>
      </Container>
      <Formulas>
        <Accordion.Item className="formula-item">
          <Accordion.Trigger>How are these calculated?</Accordion.Trigger>
          <Accordion.Panel>
            <VStack gap={4} marginTop={2} className="formula-inner">
              {accessibility ? (
                <>
                  <code>
                    Visual Snapshots = Tests x Builds x Browsers x Viewports
                  </code>
                  <code>
                    Accessibility Snapshots = Tests x Builds x Viewports
                  </code>
                  <hr />
                  <code>
                    Snapshots = Visual Snapshots + Accessibility Snapshots
                  </code>
                </>
              ) : (
                <>
                  <code>
                    Snapshots = (Tests x Builds x Browsers x Viewports)
                  </code>
                </>
              )}
              <hr />
              {turboSnap ? (
                <>
                  <code>TurboSnaps = Tests - Tests with changes</code>
                  <hr />
                  <code>Billed Snapshots = Snapshots + 0.2 * TurboSnaps</code>
                </>
              ) : (
                <>
                  <code>Billed Snapshots = Snapshots</code>
                </>
              )}
            </VStack>
          </Accordion.Panel>
        </Accordion.Item>
      </Formulas>
    </>
  );
};

function toPlural(count: number, single: string): string {
  return `${single}${count === 1 ? "" : "s"}`;
}
