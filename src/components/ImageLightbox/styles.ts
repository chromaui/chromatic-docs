import { color } from '@chromatic-com/tetra';

/** Global styles for zoomable content images and the lightbox dialog. */
export const lightboxStyles = /* css */ `
  img.zoomable {
    cursor: zoom-in;
  }

  img.zoomable:focus-visible {
    outline: 2px solid ${color.blue500};
    outline-offset: 2px;
  }

  html:has(.image-lightbox[open]) {
    overflow: hidden;
  }

  .image-lightbox {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: zoom-out;
  }

  .image-lightbox[open] {
    display: flex;
    align-items: center;
    justify-content: center;
    animation: image-lightbox-fade 150ms ease-out;
  }

  .image-lightbox::backdrop {
    background: rgba(0, 0, 0, 0.85);
  }

  .image-lightbox-img {
    display: block;
    max-width: calc(100vw - 4rem);
    max-height: calc(100vh - 4rem);
    width: auto;
    height: auto;
    object-fit: contain;
    background: ${color.white};
    border-radius: 4px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  /* SVG diagrams have no intrinsic pixel size; let them fill the viewport */
  .image-lightbox-img[data-vector] {
    width: calc(100vw - 8rem);
    height: calc(100vh - 8rem);
    padding: 1.5rem;
    box-sizing: border-box;
  }

  .image-lightbox-close {
    position: fixed;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    color: ${color.white};
    cursor: pointer;
  }

  .image-lightbox-close:hover,
  .image-lightbox-close:focus-visible {
    background: rgba(0, 0, 0, 0.85);
  }

  @keyframes image-lightbox-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .image-lightbox[open] {
      animation: none;
    }
  }
`;
