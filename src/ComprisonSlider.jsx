import { useCallback, useEffect, useState, useRef } from 'react';
import { ReactComponent as CompareIcon } from './assets/compare.svg';
import './styles.css';

const ComparisonSlider = ({ topImage, bottomImage }) => {
  const [isResizing, setIsResizing] = useState(false);
  const topImageRef = useRef();
  const handleRef = useRef();

  const setPositioning = useCallback((x) => {
    const { left, width } = topImageRef.current.getBoundingClientRect();
    const handleWidth = handleRef.current.offsetWidth;

    if (x >= left && x <= width + left - handleWidth) {
      handleRef.current.style.left = `${((x - left) / width) * 100}%`;
      topImageRef.current.style.clipPath = `inset(0 ${
        100 - ((x - left) / width) * 100
      }% 0 0)`;
    }
  }, []);

  const handleResize = useCallback(
    (e) => {
      if (e.clientX) {
        setPositioning(e.clientX);
      } else if (
        e.touches &&
        Array.isArray(e.touches) &&
        e.touches.length &&
        e.touches[0] &&
        e.touches[0].clientX
      ) {
        setPositioning(e.touches[0].clientX);
      }
    },
    [setPositioning]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('touchmove', handleResize);
    window.removeEventListener('mouseup', handleResizeEnd);
    window.removeEventListener('touchend', handleResizeEnd);
  }, [handleResize]);

  const onKeyDown = useCallback((e) => {
    if (!handleRef.current) {
      return;
    }
    const { offsetLeft, offsetParent } = handleRef.current;

    if (e.code == 'ArrowLeft') {
      setPositioning(offsetLeft + offsetParent.offsetLeft - 10);
    }

    if (e.code == 'ArrowRight') {
      setPositioning(offsetLeft + offsetParent.offsetLeft + 10);
    }
  }, []);

  // set initial resize on component mount
  useEffect(() => {
    const { left, width } = topImageRef.current.getBoundingClientRect();
    const handleWidth = handleRef.current.offsetWidth;

    setPositioning(width / 2 + left - handleWidth / 2);
  }, [setPositioning]);

  // add keydown event on mount
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('touchmove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
      window.addEventListener('touchend', handleResizeEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('touchmove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing, handleResize, handleResizeEnd]);

  return (
    <div className="comparison-slider">
      <div
        ref={handleRef}
        className="handle"
        onMouseDown={() => setIsResizing(true)}
        onTouchStart={() => setIsResizing(true)}
      >
        <CompareIcon />
      </div>
      <div ref={topImageRef} className="comparison-item top">
        <img src={topImage.src} alt={topImage.alt} draggable="false" />
      </div>
      <div className="comparison-item">
        <img src={bottomImage.src} alt={bottomImage.alt} draggable="false" />
      </div>
    </div>
  );
};

export default ComparisonSlider;
