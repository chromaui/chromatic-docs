import React from "react";

type LabelKey = "opensource" | "enterprise" | "billing" | "promo";

// Keep in sync with monorepo chromatic-lib/constants/PlainLabels.ts.
const LABEL_IDS: Record<LabelKey, string> = {
  opensource: "lt_01KPDSS8GQ2JGK6BPGY18QHNH9",
  enterprise: "lt_01KPDSTGS7PRM6QANFCQTY8DRX",
  billing: "lt_01KJFR42S7PB52DNG9T815456N",
  promo: "lt_01KJFR42S7PB52DNG9T815456N",
};

export function PlainOpenLink({
  label,
  children,
}: {
  label: LabelKey;
  children: React.ReactNode;
}) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.Plain?.isInitialized?.()) {
      window.Plain.open({
        threadDetails: { labelTypeIds: [LABEL_IDS[label]] },
      });
    }
  };

  return (
    <a href="#" onClick={onClick}>
      {children}
    </a>
  );
}
