import { useState, useRef, useEffect, ReactNode } from 'react';
import './PullToRefresh.css';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  disabled?: boolean;
  pullThreshold?: number;
  refreshThreshold?: number;
}

const PullToRefresh = ({ 
  onRefresh, 
  children, 
  disabled = false,
  pullThreshold = 60,
  refreshThreshold = 80
}: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const isPullingRef = useRef<boolean>(false);

  useEffect(() => {
    if (disabled || !containerRef.current) return;

    const container = containerRef.current;
    let touchStartY = 0;
    let scrollTop = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      scrollTop = container.scrollTop;
      startYRef.current = touchStartY;
      isPullingRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isRefreshing) {
        e.preventDefault();
        return;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY;
      currentYRef.current = currentY;

      // Only allow pull-to-refresh if at the top of the page
      if (scrollTop === 0 && deltaY > 0) {
        isPullingRef.current = true;
        setIsPulling(true);
        const distance = Math.min(deltaY * 0.5, refreshThreshold * 1.5); // Dampen the pull
        setPullDistance(distance);
        e.preventDefault();
      } else if (deltaY <= 0) {
        isPullingRef.current = false;
        setIsPulling(false);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPullingRef.current || isRefreshing) {
        setPullDistance(0);
        setIsPulling(false);
        return;
      }

      if (pullDistance >= refreshThreshold) {
        setIsRefreshing(true);
        setPullDistance(refreshThreshold);
        
        try {
          await onRefresh();
          // Small delay to show the refresh state
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error('Refresh error:', error);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
        }
      } else {
        // Snap back if not pulled enough
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, isRefreshing, pullDistance, refreshThreshold, onRefresh]);

  const progress = Math.min((pullDistance / refreshThreshold) * 100, 100);
  const shouldShowIndicator = isPulling || isRefreshing;
  const rotation = progress * 3.6; // Convert to degrees

  return (
    <div 
      ref={containerRef} 
      className={`pull-to-refresh-container ${isPulling ? 'pulling' : ''} ${isRefreshing ? 'refreshing' : ''}`}
      style={{
        transform: shouldShowIndicator ? `translateY(${pullDistance}px)` : 'translateY(0)',
        transition: isRefreshing ? 'transform 0.3s ease' : isPulling ? 'none' : 'transform 0.3s ease'
      }}
    >
      <div 
        className={`pull-to-refresh-indicator ${shouldShowIndicator ? 'visible' : ''}`}
        style={{ opacity: shouldShowIndicator ? 1 : 0 }}
      >
        <div className="pull-to-refresh-spinner-container">
          {isRefreshing ? (
            <div className="pull-to-refresh-spinner">
              <div className="spinner-circle"></div>
            </div>
          ) : (
            <div 
              className="pull-to-refresh-arrow"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                opacity: Math.min(pullDistance / pullThreshold, 1)
              }}
            >
              ↓
            </div>
          )}
        </div>
        <p className="pull-to-refresh-text">
          {isRefreshing ? 'Refreshing...' : pullDistance >= refreshThreshold ? 'Release to refresh' : 'Pull to refresh'}
        </p>
      </div>
      <div className="pull-to-refresh-content">
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;

