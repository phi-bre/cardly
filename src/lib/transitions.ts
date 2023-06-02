import { crossfade } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export const plop = () => {
  return crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 100,
        easing: quintOut,
        css: (t) => `
          transform: ${transform} scale(${Math.max(t, 0.98)});
          opacity: ${t}
        `,
      };
    },
  });
};
