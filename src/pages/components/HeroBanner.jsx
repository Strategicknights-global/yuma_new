import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import img1 from "../../assets/image1.webp";
import img2 from "../../assets/image2.jpg";
import img3 from "../../assets/image3.jpg";
import img4 from "../../assets/image4.jpg";
import video2 from "../../assets/video2.mp4";

const HeroBanner = () => {
  const swiperRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const handleEnded = () => {
        if (swiperRef.current) {
          swiperRef.current.slideNext(); // move to next slide after first playthrough
        }
      };
      videoRef.current.addEventListener("ended", handleEnded);

      return () => {
        videoRef.current?.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-[100vh] xl:h-[100vh] bg-black overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        navigation
        effect="fade"
        speed={1000}
        className="w-full h-full"
      >
        {/* Video slide */}
        <SwiperSlide>
          <video
            ref={videoRef}
            src={video2}
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover"
            onPlay={() => {
              if (swiperRef.current) swiperRef.current.autoplay.stop();
            }}
            onEnded={() => {
              if (swiperRef.current) {
                swiperRef.current.autoplay.start();
                swiperRef.current.slideNext();
              }
            }}
          />
        </SwiperSlide>

        {/* Image slides */}
        <SwiperSlide>
          <img src={img1} alt="Banner 1" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img2} alt="Banner 2" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img3} alt="Banner 3" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img4} alt="Banner 4" className="w-full h-full object-cover" />
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default HeroBanner;