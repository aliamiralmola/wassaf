import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { ImagePlusIcon } from './icons/ImagePlusIcon';

interface ImageGalleryProps {
  images: string[];
}

const ImageCard: React.FC<{ base64Image: string, index: number }> = ({ base64Image, index }) => {
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `product-image-${index + 1}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative group overflow-hidden rounded-xl shadow-lg fade-in-up" style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}>
            <img src={imageUrl} alt={`Generated product image ${index + 1}`} className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white/90 text-slate-800 font-semibold py-2 px-4 rounded-full transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100"
                    aria-label="Download image"
                >
                    <DownloadIcon className="w-5 h-5"/>
                    <span>تحميل</span>
                </button>
            </div>
        </div>
    );
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ImagePlusIcon className="w-6 h-6 text-indigo-600"/>
            صور مقترحة للمنتج
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
                <ImageCard key={index} base64Image={img} index={index} />
            ))}
        </div>
    </div>
  );
};