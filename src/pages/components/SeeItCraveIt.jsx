import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const youtubeShorts = [
  { id: 1, videoId: "Lz-5ViiCZmo" },
  { id: 2, videoId: "2iHlsmkp6I4" },
  { id: 3, videoId: "qT0Olwyv108" },
  { id: 4, videoId: "JLbVad08jkQ" },
  { id: 5, videoId: "CiUEODyBsQk" },
];

const SeeItCraveIt = () => (
  <section className="py-12 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#b85a00]">See It. Crave It. Taste It</h2>
      <Swiper
        effect={"creative"}
        grabCursor
        centeredSlides
        slidesPerView={1.3}
        spaceBetween={20}
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, EffectCreative]}
        creativeEffect={{
          prev: { shadow: true, translate: ["-25%", 0, -200], rotate: [0, 0, -8] },
          next: { shadow: true, translate: ["25%", 0, -200], rotate: [0, 0, 8] },
        }}
        className="w-full max-w-5xl"
      >
        {youtubeShorts.map(short => (
          <SwiperSlide key={short.id} className="w-52 h-[45rem] md:w-60 md:h-[50rem]">
            <div className="relative w-full h-96 bg-gradient-to-b from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700 group hover:scale-[1.02] transition-all duration-300">
              <iframe
                className="w-full h-full object-cover"
                src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&mute=1&loop=1&playlist=${short.videoId}`}
                title="YouTube Short"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default SeeItCraveIt;
