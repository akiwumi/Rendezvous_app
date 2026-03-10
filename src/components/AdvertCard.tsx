import { useEffect, useRef, useState } from 'react';
import { Advertisement } from '../types';
import { advertisementService } from '../services/localDataService';
import './AdvertCard.css';

interface AdvertCardProps {
  ad: Advertisement;
}

const AdvertCard = ({ ad }: AdvertCardProps) => {
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tracked = useRef(false);

  // Track impression once on mount
  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      advertisementService.trackImpression(ad.id);
    }
  }, [ad.id]);

  const handleVisit = () => {
    advertisementService.trackClick(ad.id);
    window.open(ad.advertiserUrl, '_blank', 'noopener,noreferrer');
  };

  const isYoutube = ad.mediaUrl.includes('youtube.com') || ad.mediaUrl.includes('youtu.be');
  const isVimeo = ad.mediaUrl.includes('vimeo.com');
  const isEmbed = isYoutube || isVimeo;

  const getEmbedUrl = () => {
    if (isYoutube) {
      const id = ad.mediaUrl.split('v=')[1]?.split('&')[0] || ad.mediaUrl.split('/').pop();
      return `https://www.youtube.com/embed/${id}?rel=0`;
    }
    if (isVimeo) {
      const id = ad.mediaUrl.split('/').pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    return ad.mediaUrl;
  };

  return (
    <>
      {fullscreen && (
        <div className="advert-fullscreen-overlay" onClick={() => setFullscreen(false)}>
          <div className="advert-fullscreen-inner" onClick={e => e.stopPropagation()}>
            <button className="advert-fs-close" onClick={() => setFullscreen(false)}>✕</button>
            {ad.mediaType === 'video' ? (
              isEmbed ? (
                <iframe
                  src={getEmbedUrl()}
                  className="advert-fs-iframe"
                  allowFullScreen
                  title={ad.title}
                />
              ) : (
                <video src={ad.mediaUrl} className="advert-fs-video" controls autoPlay />
              )
            ) : (
              <img src={ad.mediaUrl} alt={ad.title} className="advert-fs-image" />
            )}
            <div className="advert-fs-footer">
              <p className="advert-fs-title">{ad.title}</p>
              {ad.description && <p className="advert-fs-desc">{ad.description}</p>}
              <button className="advert-visit-btn" onClick={handleVisit}>
                Visit {ad.advertiserName} →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="advert-card">
        <div className="advert-card-label">
          <span>Sponsored</span>
        </div>

        {/* Media */}
        <div className="advert-media-wrap">
          {ad.mediaType === 'image' ? (
            <img src={ad.mediaUrl} alt={ad.title} className="advert-media-img" />
          ) : isEmbed ? (
            <iframe
              src={getEmbedUrl()}
              className="advert-media-iframe"
              allowFullScreen={ad.allowFullscreen}
              title={ad.title}
            />
          ) : (
            <video
              ref={videoRef}
              src={ad.mediaUrl}
              className="advert-media-video"
              poster={ad.thumbnailUrl}
              controls
              playsInline
            />
          )}
          {ad.mediaType === 'video' && ad.allowFullscreen && (
            <button
              className="advert-fullscreen-btn"
              onClick={() => setFullscreen(true)}
              aria-label="Fullscreen"
            >
              ⛶
            </button>
          )}
        </div>

        {/* Body */}
        <div className="advert-card-body">
          <p className="advert-card-advertiser">{ad.advertiserName}</p>
          <p className="advert-card-title">{ad.title}</p>
          {ad.description && <p className="advert-card-desc">{ad.description}</p>}
          <button className="advert-visit-btn" onClick={handleVisit}>
            Visit {ad.advertiserName} →
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvertCard;
