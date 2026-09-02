/**
 * Mobile Bottom Sheet Touch Gesture Controller
 *
 * Enables fluid, native-feeling swipe-to-dismiss gestures for mobile bottom sheets:
 * - Real-time downward translation tracking user's finger.
 * - Elastic resistance when pulled upwards.
 * - Velocity & distance threshold detection on release.
 * - Smooth spring-back snap animation if released below threshold.
 * - Backdrop touch-scroll suppression.
 */

export interface BottomSheetSwipeOptions {
  overlay: HTMLElement;
  container: HTMLElement;
  handle: HTMLElement;
  header?: HTMLElement;
  onClose: () => void;
  thresholdPx?: number;
  velocityThreshold?: number;
}

export function attachBottomSheetSwipe(options: BottomSheetSwipeOptions): () => void {
  const {
    overlay,
    container,
    handle,
    header,
    onClose,
    thresholdPx = 80,
    velocityThreshold = 0.5,
  } = options;

  let startY = 0;
  let currentY = 0;
  let startTime = 0;
  let isDragging = false;

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    startY = touch.clientY;
    currentY = startY;
    startTime = Date.now();
    isDragging = true;
    container.style.transition = 'none';
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    currentY = touch.clientY;
    const deltaY = currentY - startY;

    if (deltaY >= 0) {
      container.style.transform = `translateY(${deltaY}px)`;
    } else {
      // Elastic resistance when dragging upwards
      const damped = deltaY * 0.25;
      container.style.transform = `translateY(${damped}px)`;
    }

    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    isDragging = false;

    const deltaY = currentY - startY;
    const deltaTime = Math.max(1, Date.now() - startTime);
    const velocity = deltaY / deltaTime; // px/ms

    // Require real swipe duration (>= 30ms) for velocity flicks to avoid synthetic instant-event false positives
    const isFlick = deltaY > 30 && deltaTime >= 30 && velocity > velocityThreshold;
    const shouldDismiss = deltaY >= thresholdPx || isFlick;

    if (shouldDismiss) {
      container.style.transition = 'transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)';
      container.style.transform = 'translateY(100%)';
      onClose();
      setTimeout(() => {
        container.style.transform = '';
        container.style.transition = '';
      }, 250);
    } else {
      // Snap back smoothly
      container.style.transition = 'transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1)';
      container.style.transform = '';
      setTimeout(() => {
        container.style.transition = '';
      }, 200);
    }
  };

  const onTouchCancel = () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.transition = 'transform 0.2s ease-out';
    container.style.transform = '';
    setTimeout(() => {
      container.style.transition = '';
    }, 200);
  };

  const onOverlayTouchMove = (e: TouchEvent) => {
    // Prevent backdrop drag from scrolling the underlying page
    if (e.target === overlay && e.cancelable) {
      e.preventDefault();
    }
  };

  // Register listeners on handle
  handle.addEventListener('touchstart', onTouchStart, { passive: true });
  handle.addEventListener('touchmove', onTouchMove, { passive: false });
  handle.addEventListener('touchend', onTouchEnd, { passive: true });
  handle.addEventListener('touchcancel', onTouchCancel, { passive: true });

  // If header exists, register on header as well for broader hit-target
  if (header && header !== handle) {
    header.addEventListener('touchstart', onTouchStart, { passive: true });
    header.addEventListener('touchmove', onTouchMove, { passive: false });
    header.addEventListener('touchend', onTouchEnd, { passive: true });
    header.addEventListener('touchcancel', onTouchCancel, { passive: true });
  }

  // Prevent background touch scrolling on overlay backdrop
  overlay.addEventListener('touchmove', onOverlayTouchMove, { passive: false });

  // Return cleanup function
  return () => {
    handle.removeEventListener('touchstart', onTouchStart);
    handle.removeEventListener('touchmove', onTouchMove);
    handle.removeEventListener('touchend', onTouchEnd);
    handle.removeEventListener('touchcancel', onTouchCancel);

    if (header && header !== handle) {
      header.removeEventListener('touchstart', onTouchStart);
      header.removeEventListener('touchmove', onTouchMove);
      header.removeEventListener('touchend', onTouchEnd);
      header.removeEventListener('touchcancel', onTouchCancel);
    }

    overlay.removeEventListener('touchmove', onOverlayTouchMove);
  };
}
