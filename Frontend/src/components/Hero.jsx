import { useEffect, useState } from "react";
import { assets } from "../assets/greencart/greencart_assets/assets";

// Since assets.main_banner_bg was used before, we'll create a local reference for our new images
const slides = [
  {
    image: "/hero_banner.png"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
        <div className="relative h-[350px] sm:h-[450px] md:h-[600px] w-full overflow-hidden rounded-[2rem] shadow-2xl">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                idx === current ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-8 pointer-events-none z-0 invisible"
              }`}
            >
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = assets.main_banner_bg;
                }}
              />
              

              
            </div>
          ))}

          {/* Indicators */}
          
        </div>
      </div>
    </section>
  );
}
