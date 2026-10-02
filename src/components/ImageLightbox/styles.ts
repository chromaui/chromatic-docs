import { color, spacing } from '@chromatic-com/tetra';

/** Global styles for zoomable content images and the lightbox dialog. */
export const lightboxStyles = /* css */ `
  img.zoomable {
    cursor: zoom-in;
  }

  img.zoomable:focus-visible {
    outline: ${spacing[0.5]} solid ${color.blue500};
    outline-offset: ${spacing[0.5]};
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
    background: ${color.slate900};
    opacity: 0.9;
  }

  .image-lightbox-img {
    display: block;
    max-width: calc(100vw - ${spacing[16]});
    max-height: calc(100vh - ${spacing[16]});
    width: auto;
    height: auto;
    object-fit: contain;
    background: ${color.white};
    border-radius: ${spacing[1]};
  }

  /* SVG diagrams have no intrinsic pixel size; let them fill the viewport */
  .image-lightbox-img[data-vector] {
    width: calc(100vw - ${spacing[32]});
    height: calc(100vh - ${spacing[32]});
    padding: ${spacing[6]};
    box-sizing: border-box;
  }

  .image-lightbox-close {
    position: fixed;
    top: ${spacing[4]};
    right: ${spacing[4]};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${spacing[10]};
    height: ${spacing[10]};
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: ${color.slate700};
    cursor: pointer;
  }

  .image-lightbox-close:hover,
  .image-lightbox-close:focus-visible {
    background: ${color.slate600};
  }

  .image-lightbox-close:focus-visible {
    outline: ${spacing[0.5]} solid ${color.blue500};
    outline-offset: ${spacing[0.5]};
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
