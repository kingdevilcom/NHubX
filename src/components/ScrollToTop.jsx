import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const startPosition = window.pageYOffset;
    const duration = 1200;

    let start = null;

    const easeInOutCubic = (t) => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime) => {
      if (start === null) start = currentTime;

      const timeElapsed = currentTime - start;

      const progress = Math.min(
        timeElapsed / duration,
        1
      );

      const ease = easeInOutCubic(progress);

      window.scrollTo(
        0,
        startPosition * (1 - ease)
      );

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
