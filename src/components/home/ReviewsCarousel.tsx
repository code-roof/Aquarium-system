"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import { Quote, Star } from "lucide-react";
import "swiper/css";
import { homeReviews } from "@/data/reviews";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function ReviewsCarousel() {
  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeading
        eyebrow="Loved by aquarists"
        title="Real fish, happy hobbyists"
        description="Feedback on our live fish from customers across Colombo, Kandy, Negombo and beyond."
        action={
          <span className="rounded-full bg-amber-50 px-4 py-2 text-[13px] font-semibold text-amber-600 ring-1 ring-amber-200">
            Demo reviews — prototype content
          </span>
        }
      />

      <div className="relative mt-12">
        <Swiper
          modules={[Autoplay, EffectCoverflow, Navigation]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          speed={720}
          slidesPerView={1}
          coverflowEffect={{
            rotate: 32,
            stretch: 0,
            depth: 150,
            modifier: 1,
            slideShadows: false,
          }}
          navigation={{ prevEl: "#review-prev", nextEl: "#review-next" }}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1100: { slidesPerView: 3, coverflowEffect: { rotate: 24, depth: 120 } },
          }}
          className="!overflow-hidden"
          style={{ padding: "14px 6px 34px", margin: "-14px -6px -34px" }}
        >
          {homeReviews.map((review) => (
            <SwiperSlide key={review.id} className="h-auto">
              <figure className="card-base mx-1 flex h-full flex-col gap-5 rounded-3xl p-7">
                <Quote size={30} className="shrink-0 text-ocean-200" />
                <blockquote className="text-[15.5px] leading-relaxed text-slate-600">
                  {review.text}
                </blockquote>
                <figcaption className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3.5">
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-mist ring-2 ring-ocean-100">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold text-navy-950">
                        {review.name}
                      </span>
                      <span className="block truncate text-[13px] text-slate-400">
                        {review.location}
                      </span>
                    </span>
                  </div>
                  <span
                    className="flex shrink-0 gap-0.5"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={cn(
                          i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        )}
                      />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-6 flex items-center justify-center gap-3">
          <ArrowBtn side="left" />
          <ArrowBtn side="right" />
        </div>
      </div>
    </section>
  );
}

function ArrowBtn({ side }: { side: "left" | "right" }) {
  return (
    <button
      type="button"
      id={side === "left" ? "review-prev" : "review-next"}
      aria-label={side === "left" ? "Previous review" : "Next review"}
      className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-ocean-700 shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-ocean-300 hover:bg-white hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-500"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ transform: side === "left" ? "rotate(180deg)" : undefined }}
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
