import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { rehype } from 'rehype';
import rehypeZoomableImages from '../../plugins/rehype-zoomable-images';
import { initImageLightbox } from './image-lightbox';
import { LightboxDialog } from './LightboxDialog';
import { lightboxStyles } from './styles';

/*
 * Docs content as it reaches the plugin: Markdown images become `img`
 * elements; hand-written HTML is still raw (`rehypeRaw` runs later), so it
 * isn't represented here. Running the real plugin keeps the story honest
 * about which images end up zoomable.
 */
const sourceHtml = `
  <p>A screenshot:</p>
  <p><img src="/a11y-build.png" alt="Accessibility build screen"></p>
  <p>A diagram:</p>
  <p><img class="diagram" src="/diagrams/access-model.svg" alt="Access model diagram"></p>
  <p>An animated GIF stays inline:</p>
  <p><img src="/visual-bugs.gif" alt="Animated visual bugs"></p>
  <p>A linked image keeps its link:</p>
  <p><a href="#linked"><img src="/account-menu.png" alt="Account menu"></a></p>
`;

const contentHtml = rehype()
  .data('settings', { fragment: true })
  .use(rehypeZoomableImages)
  .processSync(sourceHtml)
  .toString();

function DocsContent() {
  useEffect(() => initImageLightbox(document), []);
  return (
    <>
      <style>{lightboxStyles}</style>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <LightboxDialog />
    </>
  );
}

const meta = {
  title: 'Components/ImageLightbox',
  component: DocsContent,
} satisfies Meta<typeof DocsContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const getImg = (root: HTMLElement, alt: string) =>
  root.querySelector<HTMLImageElement>(`img[alt="${alt}"]`)!;
const getDialog = (root: HTMLElement) =>
  root.ownerDocument.querySelector<HTMLDialogElement>('dialog.image-lightbox');
const isOpen = (root: HTMLElement) => getDialog(root)?.open ?? false;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const screenshot = getImg(canvasElement, 'Accessibility build screen');
    await waitFor(() => expect(screenshot).toHaveAttribute('tabindex', '0'));
    await expect(screenshot).toHaveClass('zoomable');
    await expect(screenshot).toHaveAttribute('role', 'button');
    await expect(screenshot).toHaveAttribute(
      'aria-label',
      'Enlarge image: Accessibility build screen'
    );
    await expect(getImg(canvasElement, 'Access model diagram')).toHaveClass('diagram', 'zoomable');

    for (const alt of ['Animated visual bugs', 'Account menu']) {
      const img = getImg(canvasElement, alt);
      await expect(img).not.toHaveClass('zoomable');
      await expect(img).not.toHaveAttribute('role');
    }
  },
};

export const OpenScreenshot: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(getImg(canvasElement, 'Accessibility build screen'));
    await waitFor(() => expect(isOpen(canvasElement)).toBe(true));
    const preview = getDialog(canvasElement)!.querySelector('img')!;
    await expect(preview.src).toMatch(/\/a11y-build\.png$/);
    await expect(preview).toHaveAttribute('alt', 'Accessibility build screen');
    await expect(preview).not.toHaveAttribute('data-vector');
  },
};

export const OpenDiagram: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(getImg(canvasElement, 'Access model diagram'));
    await waitFor(() => expect(isOpen(canvasElement)).toBe(true));
    await expect(getDialog(canvasElement)!.querySelector('img')).toHaveAttribute('data-vector');
  },
};

export const OpenWithKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const screenshot = getImg(canvasElement, 'Accessibility build screen');
    await waitFor(() => expect(screenshot).toHaveAttribute('tabindex', '0'));
    screenshot.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(isOpen(canvasElement)).toBe(true));
    // Esc-to-close is native <dialog> behavior and only fires for trusted key
    // presses, which userEvent can't produce; close via the button instead.
    await userEvent.click(
      getDialog(canvasElement)!.querySelector<HTMLButtonElement>('.image-lightbox-close')!
    );
    await waitFor(() => expect(isOpen(canvasElement)).toBe(false));

    screenshot.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(isOpen(canvasElement)).toBe(true));
  },
};

export const CloseWithButton: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(getImg(canvasElement, 'Accessibility build screen'));
    await waitFor(() => expect(isOpen(canvasElement)).toBe(true));
    const close = getDialog(canvasElement)!.querySelector<HTMLButtonElement>(
      'button.image-lightbox-close'
    )!;
    await expect(close).toHaveAccessibleName('Close enlarged image');
    await userEvent.click(close);
    await waitFor(() => expect(isOpen(canvasElement)).toBe(false));
    await expect(getDialog(canvasElement)!.querySelector('img')).not.toHaveAttribute('src');
  },
};

export const CloseByClickingImage: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(getImg(canvasElement, 'Accessibility build screen'));
    await waitFor(() => expect(isOpen(canvasElement)).toBe(true));
    await userEvent.click(getDialog(canvasElement)!.querySelector('img')!);
    await waitFor(() => expect(isOpen(canvasElement)).toBe(false));
  },
};

export const GifDoesNotOpen: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(getImg(canvasElement, 'Animated visual bugs'));
    await expect(isOpen(canvasElement)).toBe(false);
  },
};
