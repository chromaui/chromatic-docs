import type { Meta, StoryObj } from "@storybook/react-vite";

interface DiagramArgs {
  name: string;
  alt: string;
}

const meta = {
  title: "Diagrams",
  render: ({ name, alt }) => (
    <img className="diagram" src={`/diagrams/${name}.svg`} alt={alt} />
  ),
} satisfies Meta<DiagramArgs>;

export default meta;
type Story = StoryObj<DiagramArgs>;

export const BranchesBaselinesOverview: Story = {
  args: {
    name: "branches-baselines-overview",
    alt: "Git graph with main branch commits M, A, B, C and a new_feature branch off M with commits D, E, F. M and F are highlighted.",
  },
};

export const UnwantedChangesOnFeature: Story = {
  args: {
    name: "unwanted-changes-on-feature",
    alt: 'Git graph with main branch commit X and a feature-branch off X with commits A (tagged "unwanted changes"), B, and C.',
  },
};

export const AncestorPreviousCommit: Story = {
  args: {
    name: "ancestor-previous-commit",
    alt: "Two sequential commits x (Build N) and y (Build N+1) on a single branch.",
  },
};

export const AncestorWithGap: Story = {
  args: {
    name: "ancestor-with-gap",
    alt: "Three sequential commits x (Build N), y (no build), and z (Build N+1) on a single branch.",
  },
};

export const AncestorMergeCommit: Story = {
  args: {
    name: "ancestor-merge-commit",
    alt: "Git graph with main branch commits w and x (Build N), new_feature branch with commit p (Build N+1), then a merge into main as y (Build N+2), followed by z.",
  },
};

export const RevertRestoreColor: Story = {
  args: {
    name: "revert-restore-color",
    alt: "Three sequential commits x (Build N), y (Build N+1), and z (Build N+2) on a single branch.",
  },
};

export const MergeBaseTypical: Story = {
  args: {
    name: "merge-base-typical",
    alt: "Git graph with base branch (commits x, y, z) and a head branch off x with commits w, p, q. x and q are highlighted as the merge base and head commit.",
  },
};

export const MergeBaseUpdated: Story = {
  args: {
    name: "merge-base-updated",
    alt: "Git graph where the head branch (commits w, p) has been updated from the base branch (commits y, z) via a merge commit q. z and q are highlighted.",
  },
};

export const GithubActionsEphemeralMerge: Story = {
  args: {
    name: "github-actions-ephemeral-merge",
    alt: "Git graph showing how GitHub's pull_request event creates an ephemeral merge commit P' from the feature branch (commit P) and the latest main (commits A, B, C, D).",
  },
};

export const TurbosnapFullRebuildMerge: Story = {
  args: {
    name: "turbosnap-full-rebuild-merge",
    alt: "Git graph where a change to preview.js on feature-2 triggers a full rebuild on F2.1, propagating rebuild tags through merges into main (M.2) and feature-1 (F1.2).",
  },
};

export const TurbosnapRebaseAncestor: Story = {
  args: {
    name: "turbosnap-rebase-ancestor",
    alt: "Git graph where a feature branch with commits F.1 and F.2 is merged into main as M.2, which takes both F.2 and M.1 as ancestor builds.",
  },
};

export const TurbosnapReplacementBuild: Story = {
  args: {
    name: "turbosnap-replacement-build",
    alt: "Git graph illustrating TurboSnap's replacement-build behavior: feature-1 with rebased commits F1.1 and F1.2 takes M.1 and M.2 as TurboSnap ancestors on F1.3 after merging from main.",
  },
};
