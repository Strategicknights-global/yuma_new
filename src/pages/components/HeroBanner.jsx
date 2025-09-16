import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import img1 from "../../assets/image1.webp";
import img2 from "../../assets/image2.jpg";
import img3 from "../../assets/image3.jpg";
import img4 from "../../assets/image4.jpg";
import video1 from "../../assets/video1.mp4";

const HeroBanner = () => (
  <section className="relative w-full h-[350px] md:h-[500px] bg-black overflow-hidden">
    <Swiper modules={[Autoplay, Pagination, Navigation]} autoplay={{ delay: 4000 }} loop pagination={{ clickable: true }} navigation className="w-full h-full">
      <SwiperSlide><video src={video1} autoPlay loop muted playsInline className="w-full h-full object-cover" /></SwiperSlide>
      <SwiperSlide><img src={img1} alt="Banner 1" className="w-full h-full object-cover" /></SwiperSlide>
      <SwiperSlide><img src={img2} alt="Banner 2" className="w-full h-full object-cover" /></SwiperSlide>
      <SwiperSlide><img src={img3} alt="Banner 3" className="w-full h-full object-cover" /></SwiperSlide>
      <SwiperSlide><img src={img4} alt="Banner 4" className="w-full h-full object-cover" /></SwiperSlide>
    </Swiper>
  </section>
);

export default HeroBanner;
