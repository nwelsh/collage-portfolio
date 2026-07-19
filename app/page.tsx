"use client";

import { useRef, useState, useEffect } from "react";
import { Crafty_Girls } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const craftyGirls = Crafty_Girls({
  weight: "400",
  subsets: ["latin"],
});

gsap.registerPlugin(ScrollTrigger);

const STORAGE_KEY = "scrapbook-images";

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved images when page opens
  useEffect(() => {
    const savedImages = sessionStorage.getItem(STORAGE_KEY);

    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  // Save images whenever they change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }, [images]);

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const fileArray = Array.from(files);

    Promise.all(
      fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve(reader.result as string);
          };

          reader.readAsDataURL(file);
        });
      }),
    ).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
    });
  }

  function deleteImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 35,
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="photo"
            style={{
              position: "relative",
              width: 250,
            }}
          >
            <img
              src={src}
              alt=""
              style={{
                width: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            <button
              className="delete-button"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                cursor: "pointer",
              }}
              onClick={() => deleteImage(i)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
