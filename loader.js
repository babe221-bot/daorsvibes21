'use client';

// See "Custom Image Loaders" in the Next.js documentation for more info:
// https://nextjs.org/docs/app/api-reference/components/image#loader

export default function cloudinaryLoader({ src, width, quality }) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  return `/_fah/image/${src}?${params.join(',')}`;
}
