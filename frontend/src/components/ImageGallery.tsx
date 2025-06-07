import React, { useState } from 'react';
// Importa React e o hook useState para controlar o estado da imagem selecionada

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
// Importa ícones de navegação e fechar da biblioteca lucide-react

interface ImageGalleryProps {
  images: Array<{
    src: string;         // Caminho da imagem
    alt: string;         // Texto alternativo (acessibilidade)
    caption?: string;    // Legenda opcional
  }>;
}
// Define o tipo esperado das props: um array de objetos com dados das imagens

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  // Estado que armazena o índice da imagem atualmente aberta no lightbox (null se nenhuma estiver aberta)

  const openLightbox = (index: number) => {
    setSelectedImage(index); // Abre o lightbox com a imagem clicada
  };

  const closeLightbox = () => {
    setSelectedImage(null); // Fecha o lightbox
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;

    if (direction === 'prev') {
      // Volta para a imagem anterior (com looping)
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    } else {
      // Avança para a próxima imagem (com looping)
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <div>
      {/* Grade de miniaturas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            onClick={() => openLightbox(index)}
          >
            <div className="relative h-64">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              {/* Legenda na imagem (caso exista) */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary bg-opacity-70 p-3">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox em tela cheia */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Botão de fechar */}
          <button
            className="absolute top-4 right-4 text-white hover:text-secondary transition-colors"
            onClick={closeLightbox}
            aria-label="Fechar"
          >
            <X size={32} />
          </button>

          {/* Botão de imagem anterior */}
          <button
            className="absolute left-4 text-white hover:text-secondary transition-colors"
            onClick={() => navigateImage('prev')}
            aria-label="Anterior"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Imagem grande central com legenda */}
          <div className="max-w-5xl max-h-[80vh] relative">
            <img
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {images[selectedImage].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-primary bg-opacity-70 p-3">
                <p className="text-white text-center">
                  {images[selectedImage].caption}
                </p>
              </div>
            )}
          </div>

          {/* Botão de próxima imagem */}
          <button
            className="absolute right-4 text-white hover:text-secondary transition-colors"
            onClick={() => navigateImage('next')}
            aria-label="Próximo"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
// Exporta o componente para ser usado em outras páginas
