import React, { useState, useEffect } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  // Use a simple, low-res placeholder or just a background color
  const placeholderStyle = {
    backgroundColor: '#f0f2f5', // brand-surface-alt
    filter: 'blur(10px)',
    transition: 'filter 0.5s ease',
  };

  const loadedStyle = {
    filter: 'blur(0)',
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${src.replace('/300/300', '/50/50')})`, // Use a smaller version for placeholder
          ...(isLoading ? placeholderStyle : loadedStyle),
        }}
        aria-hidden="true"
      />
      <img
        src={imageSrc || ''}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
      />
    </div>
  );
};

export default Image;