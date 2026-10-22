import React, { useState } from 'react';
import { ExternalLink, Sparkles, UserCheck } from 'lucide-react';

interface DriveImageProps {
  driveId: string;
  alt: string;
  className?: string;
  badgeText?: string;
  fallbackIcon?: React.ReactNode;
}

export const DriveImage: React.FC<DriveImageProps> = ({
  driveId,
  alt,
  className = '',
  badgeText = 'SENA CSF',
  fallbackIcon
}) => {
  // URLs attempts for Google Drive images
  const candidateUrls = [
    `https://lh3.googleusercontent.com/d/${driveId}`,
    `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`,
    `https://drive.google.com/uc?export=view&id=${driveId}`
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (currentIndex < candidateUrls.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-emerald-800 to-green-950 shadow-lg group ${className}`}>
      {/* Background glow & decorative elements */}
      <div className="absolute inset-0 bg-radial from-white/10 to-transparent opacity-40 pointer-events-none" />

      {!hasError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-900/60 backdrop-blur-sm z-10 animate-pulse">
              <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-xs text-emerald-100 font-medium">Cargando imagen institucional...</span>
            </div>
          )}
          <img
            src={candidateUrls[currentIndex]}
            alt={alt}
            onError={handleError}
            onLoad={handleLoad}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </>
      ) : (
        /* Graceful fallback banner if Google Drive blocks cross-origin viewing */
        <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-emerald-800 via-green-800 to-teal-900 text-white">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-3 shadow-inner">
            {fallbackIcon || <UserCheck className="w-8 h-8 text-emerald-300" />}
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Aprendices SENA CSF
          </span>
          <h4 className="font-bold text-base text-white mb-1">{alt}</h4>
          <p className="text-xs text-emerald-100/80 max-w-xs mb-3">
            Gestión Empresarial · Fichas 3384701 & 3384773
          </p>
        </div>
      )}

      {/* Overlaid Badges */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/15">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        {badgeText}
      </div>

      {/* External link to original drive asset */}
      <a
        href={`https://drive.google.com/file/d/${driveId}/view?usp=sharing`}
        target="_blank"
        rel="noopener noreferrer"
        title="Abrir imagen original en Google Drive"
        className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>

      {/* Bottom gradient shading */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
    </div>
  );
};
