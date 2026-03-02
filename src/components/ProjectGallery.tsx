"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  title: string;
  imageUrls: string[];
};

export default function ProjectGallery({ title, imageUrls }: Props) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {imageUrls.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            onClick={() => setZoomImage(img)}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-cyan-300/20"
            title="Open image"
          >
            <Image
              src={img}
              alt={`${title} image ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {zoomImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-12 right-0 rounded-lg border border-cyan-300/40 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-400/10"
            >
              Close ✕
            </button>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-cyan-300/30 bg-black">
              <Image
                src={zoomImage}
                alt="Project image full view"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
