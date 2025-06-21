// src/components/TeamCarousel.tsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ActivityCard from './ActivityCard'; // seu card existente

// Dados iniciais (6 fotos) {/*caso queria escrever um título na foto escrever dento do ''*/},
const photos = [
  { id: 1, src: '/assets/gl1.jpeg', name: '' }, 
  { id: 2, src: '/assets/gl2.jpeg', name: '' },
  { id: 3, src: '/assets/gl4.jpeg', name: '' }, 
  { id: 4, src: '/assets/gl5.jpeg', name: '' }, 
  { id: 5, src: '/assets/gl6.jpeg', name: '' }, 
  { id: 6, src: '/assets/gl8.jpeg', name: '' }, 
  { id: 7, src: '/assets/gl9.jpeg', name: '' }, 
  { id: 8, src: '/assets/gl10.jpeg', name: '' }, 
  { id: 9, src: '/assets/gl11.jpeg', name: '' }, 
  { id: 10, src: '/assets/gl12.jpeg', name: '' }, 
  { id: 11, src: '/assets/gl13.jpeg', name: '' }, 
];


const TeamCarousel: React.FC = () => {
  const settings = {
    dots: true,               // indicadores embaixo
    infinite: true,           // loop infinito
    speed: 100,               // velocidade da transição
    slidesToShow: 4,          // quantos cards aparecem ao mesmo tempo
    slidesToScroll: 1,        // quantos pula a cada scroll
    autoplay: true,           // autoplay ligado
    autoplaySpeed: 3000,      // 3s entre trocas
    responsive: [             // responsividade
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings:  { slidesToShow: 2 } },
      { breakpoint: 480, settings:  { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="py-12">
      <Slider {...settings}>
        {photos.map((item) => (
          <div key={item.id} className="p-4">
            <div className="card overflow-hidden group">
              <div className="h-64 overflow-hidden">
                <img 
                  src={item.src} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                <p className="text-accent-dark text-sm mb-2">  </p> {/*caso queria escrever uma leganda na foto*/}
                <p className="text-sm text-accent">
                  
                </p> {/*caso queria escrever uma leganda na foto*/}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TeamCarousel;
