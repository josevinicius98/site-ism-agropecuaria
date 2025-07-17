// src/components/TeamCarousel.tsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ActivityCard from './ActivityCard'; // seu card existente

// Dados iniciais (imagens e vídeos)
const mediaItems = [
  { id: 1, type: 'image', src: '../assets/gado_comendo.jpeg', name: '' }, 
  { id: 2, type: 'image', src: '../assets/gustavojordan_pecuaria.jpeg', name: '' },
  { id: 3, type: 'image', src: '../assets/pulverizador.jpeg', name: '' }, 
  { id: 4, type: 'image', src: '../assets/trator_verde1.jpeg', name: '' }, 
  { id: 5, type: 'video', src: '../assets/colhendo_cana.mp4', name: '' },
  { id: 6, type: 'video', src: '../assets/colhendo_sorgo.mp4', name: '' },
  { id: 7, type: 'video', src: '../assets/colhendo_sorgo2.mp4', name: '' },
  { id: 8, type: 'image', src: '../assets/homem_seringa.jpeg', name: '' }, 
  { id: 9, type: 'image', src: '../assets/tratores.jpeg', name: '' }, 
  { id: 10, type: 'image', src: '../assets/homem_curral.jpeg', name: '' }, 
  { id: 11, type: 'image', src: '../assets/gado_preto.jpeg', name: '' }, 
  { id: 12, type: 'image', src: '../assets/trator_verde2.jpeg', name: '' }, 
  { id: 12, type: 'video', src: '../assets/video_dentromaq.mp4', name: '' }, 
  { id: 12, type: 'image', src: '../assets/sorgo1.jpeg', name: '' }, 
  { id: 12, type: 'image', src: '../assets/sorgo2.jpeg', name: '' }, 
   // adicione mais conforme necessidade

];

const TeamCarousel: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings:  { slidesToShow: 2 } },
      { breakpoint: 480, settings:  { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#070735]">Galeria de Mídia</h2>
      <Slider {...settings}>
        {mediaItems.map(item => (
          <div key={item.id} className="p-4">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden group">
              <div className="h-56 overflow-hidden flex items-center justify-center bg-black">
                {item.type === 'image' ? (
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <video
                    src={item.src}
                    controls
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold mb-2 text-[#070735]">{item.name}</h3>
                {/* Se quiser descrição extra, adicione aqui */}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TeamCarousel;