/** Matches the class added by `src/plugins/rehype-zoomable-images.ts`. */
const ZOOMABLE = 'img.zoomable';

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
 * Open `img.zoomable` content images in the `dialog.image-lightbox` rendered
 * by `LightboxDialog`. Returns a cleanup function that removes the listeners
 * (used by stories; the site never tears down).
 */
export function initImageLightbox(doc: Document = document): () => void {
  function getDialog() {
    const dialog = doc.querySelector<HTMLDialogElement>('dialog.image-lightbox');
    const preview = dialog?.querySelector<HTMLImageElement>('.image-lightbox-img');
    if (!dialog || !preview) return null;
    if (!dialog.dataset.ready) {
      dialog.dataset.ready = '';
      // Any click (image, backdrop, or close button) dismisses the lightbox.
      dialog.addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => preview.removeAttribute('src'));
    }
    return { dialog, preview };
  }

  function open(img: HTMLImageElement) {
    const lightbox = getDialog();
    if (!lightbox) return;
    const { dialog, preview } = lightbox;
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
  };
}
