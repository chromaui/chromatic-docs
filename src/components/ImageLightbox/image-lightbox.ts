/** Matches the class added by `src/plugins/rehype-zoomable-images.ts`. */
const ZOOMABLE = 'img.zoomable';

const CLOSE_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
`;

function isZoomable(target: EventTarget | null): target is HTMLImageElement {
  return target instanceof HTMLImageElement && target.matches(ZOOMABLE);
}

/** Make zoomable images reachable and announced as buttons. */
function enhance(root: ParentNode) {
  root.querySelectorAll<HTMLImageElement>(`${ZOOMABLE}:not([tabindex])`).forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-haspopup', 'dialog');
    img.setAttribute('aria-label', img.alt ? `Enlarge image: ${img.alt}` : 'Enlarge image');
  });
}

/**
 * Open `img.zoomable` content images in a native `<dialog>` lightbox.
 * The dialog is created on first use. Returns a cleanup function that removes
 * the listeners and the dialog (used by stories; the site never tears down).
 */
export function initImageLightbox(doc: Document = document): () => void {
  let dialog: HTMLDialogElement | null = null;
  let preview: HTMLImageElement | null = null;

  function getDialog() {
    if (dialog && preview) return { dialog, preview };
    const el = doc.createElement('dialog');
    el.className = 'image-lightbox';
    el.setAttribute('aria-label', 'Enlarged image');
    el.innerHTML = `
      <button type="button" class="image-lightbox-close" aria-label="Close enlarged image">${CLOSE_ICON}</button>
      <img class="image-lightbox-img" alt="" />
    `;
    const img = el.querySelector('img')!;
    // Any click (image, backdrop, or close button) dismisses the lightbox.
    el.addEventListener('click', () => el.close());
    el.addEventListener('close', () => img.removeAttribute('src'));
    doc.body.appendChild(el);
    dialog = el;
    preview = img;
    return { dialog, preview };
  }

  function open(img: HTMLImageElement) {
    const { dialog, preview } = getDialog();
    const src = img.currentSrc || img.src;
    preview.src = src;
    preview.alt = img.alt;
    preview.toggleAttribute('data-vector', /\.svg($|[?#])/i.test(src));
    dialog.showModal();
  }

  function onClick(e: MouseEvent) {
    if (!(e.target instanceof Element)) return;
    const img = e.target.closest(ZOOMABLE);
    if (isZoomable(img)) open(img);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (!isZoomable(e.target)) return;
    e.preventDefault();
    open(e.target);
  }

  function onReady() {
    enhance(doc);
  }

  doc.addEventListener('click', onClick);
  doc.addEventListener('keydown', onKeydown);
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  return () => {
    doc.removeEventListener('click', onClick);
    doc.removeEventListener('keydown', onKeydown);
    doc.removeEventListener('DOMContentLoaded', onReady);
    dialog?.remove();
  };
}
