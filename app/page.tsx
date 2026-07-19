"use client";

import { useRef, useState } from "react";
import { Crafty_Girls } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

const craftyGirls = Crafty_Girls({
  weight: "400",
  subsets: ["latin"],
});

// TODO
// store images

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );

    setImages((prev) => [...prev, ...newImages]);
  }

  useEffect(() => {
    gsap.from(".photo", {
      opacity: 0,
      scale: 0.8,
      rotation: gsap.utils.random(-8, 8),
      duration: 0.6,
      stagger: 0.08,
      ease: "back.out(1.7)",
    });
  }, [images]);

  return (
    <main style={{ padding: 32 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: ".5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem" }} className={craftyGirls.className}>
          nicole's girly scrapbook
        </h1>

        <button
          onClick={() => inputRef.current?.click()}
          className={craftyGirls.className}
          style={{
            padding: ".5rem",
            background: "#e500ce",
            borderRadius: "1rem",
            color: "white",
          }}
        >
          Upload
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 35,
        }}
      >
        {images.map((src, i) => (
          <div key={i} className="photo">
            <img
              src={src}
              alt=""
              style={{
                width: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
