import { useEffect, useState } from "react";
import { styled } from "@storybook/theming";
import {
  spacing,
  color,
  VStack,
  minSm,
  fontWeight,
  Stat,
  typography,
  fontFamily,
} from "@chromatic-com/tetra";
import { calculateSnapshots } from "./calculateSnapshots";

const Container = styled.div`
  padding: ${spacing[4]};
  border-radius: 4px;
  margin-bottom: 1.5em;
  border: 1px solid ${color.blackTr10};
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

const Formula = styled.div`
  ${typography.body14}
  font-size: 12px;
  font-family: ${fontFamily.mono};
  color: ${color.slate600};
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  border-top: 1px solid ${color.blackTr10};
  padding: ${spacing[6]} ${spacing[4]};
  margin-top: ${spacing[4]};
  margin-left: -${spacing[4]};
  margin-right: -${spacing[4]};

  code {
    display: block;
    background: unset;
    padding: 0;
    border: none;
    font-size: inherit;
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
      setChangedTests(0);
    } else {
      // Start with all tests changed if turboSnap is enabled
      setChangedTests(tests);
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
    <Container>
      <VStack gap={4} marginBottom={4}>
        <Field>
          <label htmlFor="sc-tests">Number of tests</label>
          <input
            id="sc-tests"
            type="number"
            value={tests}
            onChange={(e) => setTests(Number(e.target.value))}
            min="1"
          />
        </Field>
        <Field>
          <label htmlFor="sc-builds">Builds</label>
          <input
            id="sc-builds"
            type="number"
            value={builds}
            onChange={(e) => setBuilds(Number(e.target.value))}
            min="1"
          />
        </Field>
        <Field>
          <label htmlFor="sc-browsers">Browsers</label>
          <input
            id="sc-browsers"
            type="number"
            value={browsers}
            onChange={(e) => setBrowsers(Number(e.target.value))}
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
            onChange={(e) => setViewports(Number(e.target.value))}
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
                  onChange={(e) => setChangedTests(Number(e.target.value))}
                  step="1"
                  min="0"
                  max={tests}
                />
                {/* <input
                  id="sc-test-changed"
                  type="number"
                  value={changedTests}
                  onChange={(e) => setChangedTests(Number(e.target.value))}
                  min="0"
                  max={tests}
                /> */}
              </Field>
            </>
          )}
        </Fieldset>
      </VStack>

      <Formula>
        <VStack gap={4}>
          <code>
            Snapshots ={" "}
            {accessibility
              ? "(Tests x Builds x Browsers x Viewports) x 2"
              : "Tests x Builds x Browsers x Viewports"}
          </code>
          {turboSnap && <code>TurboSnaps = Tests - Tests with changes</code>}
        </VStack>
      </Formula>
      <Result>
        <InfoStat
          unit={`${toPlural(results.snapshots, "Snapshot")} taken`}
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
  );
};

function toPlural(count: number, single: string): string {
  return `${single}${count === 1 ? "" : "s"}`;
}
