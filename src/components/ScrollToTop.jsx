import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const smoothScroll = () => {
      const currentScroll =
        document.documentElement.scrollTop ||
        document.body.scrollTop;

      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothScroll);

        window.scrollTo(
          0,
          currentScroll - currentScroll / 12
        );
      }
    };

    smoothScroll();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
