import React from 'react';

import { PLAIN_LABEL_IDS } from './plainConfig';

type LabelKey = 'opensource' | 'enterprise' | 'billing' | 'promo' | 'sales';

const LABEL_IDS: Record<LabelKey, string> = {
  opensource: PLAIN_LABEL_IDS.openSourceQualification,
  enterprise: PLAIN_LABEL_IDS.enterpriseQualification,
  billing: PLAIN_LABEL_IDS.billing,
  promo: PLAIN_LABEL_IDS.billing,
  sales: PLAIN_LABEL_IDS.sales,
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
          entryPoint: { type: 'chat' as const, externalId },
          threadDetails: { labelTypeIds: [labelTypeId], externalId },
        };
        const plain = window.Plain;
        if (!plain) return;
        plain.open(cta);
        if (typeof plain.onClose === 'function') {
          const remove = plain.onClose(() => {
            // Clear CTA-scoped config back to the widget defaults.
            plain.update?.({ entryPoint: { type: 'default' } });
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
