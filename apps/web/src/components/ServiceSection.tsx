"use client";
import Image from "next/image";

export type ServiceItem = {
  _id: string;
  order?: number | null;
  href?: string | null;
  imageUrl?: string | null;
  title?: string | null;
  desc?: string | null;
};

export default function ServiceSection({
  items,
  heading = "サービス内容",
  subheading = "― 専門アドバイザリーチームが台湾進出の第一歩を支援 ―",
  ctaText = "詳細を見る",
}: {
  items: ServiceItem[];
  heading?: string;
  subheading?: string;
  ctaText?: string;
}) {
  if (!items?.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#1C3D5A] py-16 sm:py-20">
      {/* subtle radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-sm text-slate-200 sm:text-base">{subheading}</p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it, idx) => (
            <a
              key={it._id}
              href={it.href || "#"}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]"
            >
              {/* image */}
              {it.imageUrl ? (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={it.imageUrl}
                    alt={it.title || ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-slate-700" />
              )}

              {/* index badge */}
              <div className="absolute left-3 top-3">
                <div className="rounded-xl bg-blue-500/90 px-2.5 py-1 text-xs font-bold text-white shadow">
                  {String((it.order ?? idx + 1)).padStart(2, "0")}
                </div>
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <h3 className="text-base font-semibold leading-snug text-white">
                  {it.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-200">
                  {it.desc}
                </p>

                {/* CTA */}
                <div className="mt-4">
                  <span
                    className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow transition-colors duration-200 hover:bg-[#3B82F6]"
                  >
                    {ctaText}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
