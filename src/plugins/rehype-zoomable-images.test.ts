import { describe, expect, test } from 'vitest';
import { rehype } from 'rehype';
import rehypeZoomableImages from './rehype-zoomable-images';

const process = (html: string) =>
  rehype()
    .data('settings', { fragment: true })
    .use(rehypeZoomableImages)
    .processSync(html)
    .toString();

describe('rehypeZoomableImages', () => {
  test('marks static images as zoomable', () => {
    expect(process('<p><img src="./shot.png" alt="A"></p>')).toContain('class="zoomable"');
    expect(process('<img src="./shot.jpg?w=2" alt="A">')).toContain('class="zoomable"');
    expect(process('<img src="./diagram.svg" alt="A">')).toContain('class="zoomable"');
  });

  test('keeps existing classes', () => {
    expect(process('<img class="diagram" src="./d.svg" alt="">')).toContain(
      'class="diagram zoomable"'
    );
  });

  test('skips gifs', () => {
    expect(process('<img src="./anim.gif" alt="A">')).not.toContain('zoomable');
    expect(process('<img src="./anim.GIF?x=1" alt="A">')).not.toContain('zoomable');
  });

  test('skips linked images', () => {
    expect(process('<a href="/x"><img src="./shot.png" alt="A"></a>')).not.toContain('zoomable');
  });

  test('is idempotent', () => {
    const twice = process(process('<img src="./shot.png" alt="A">'));
    expect(twice.match(/zoomable/g)).toHaveLength(1);
  });
});
