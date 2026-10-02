import React from 'react';
import { Icon } from '@chromatic-com/tetra';

/**
 * Static lightbox markup. Rendered once per page (server-side in
 * `ImageLightbox.astro`, directly in stories); `image-lightbox.ts` fills in
 * the image and opens it.
 */
export function LightboxDialog() {
  return (
    <dialog className="image-lightbox" aria-label="Enlarged image">
      <button type="button" className="image-lightbox-close" aria-label="Close enlarged image">
        <Icon name="cross" color="white" size={16} aria-hidden="true" />
      </button>
      <img className="image-lightbox-img" alt="" />
    </dialog>
  );
}
