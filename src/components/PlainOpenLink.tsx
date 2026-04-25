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
  label?: LabelKey;
  children: React.ReactNode;
}) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.Plain?.isInitialized?.()) {
      if (label) {
        // Force a *new* chat flow for CTA entry points, not a reopen of the last thread.
        // The dummy externalId makes `entryPoint.type: "chat"` open a new conversation.
        // Reset widget config on close so this is not a sticky "global" behavior for other opens.
        const labelTypeId = LABEL_IDS[label];
        const externalId = `docs-cta-${label}-${Date.now()}`;
        const cta = {
          entryPoint: { type: "chat" as const, externalId },
          threadDetails: { labelTypeIds: [labelTypeId], externalId },
        };
        const plain = window.Plain;
        if (!plain) return;
        plain.open(cta);
        if (typeof plain.onClose === "function") {
          const remove = plain.onClose(() => {
            // Clear CTA-scoped config back to the widget defaults.
            plain.update?.({ entryPoint: { type: "default" } });
            remove();
          });
        }
        return;
      }
      window.Plain.open();
    }
  };

  return (
    <a href="#" onClick={onClick}>
      {children}
    </a>
  );
}
