"use client";

import { useRef, useState, useEffect } from "react";
import { Crafty_Girls } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "./lib/superbase";

const craftyGirls = Crafty_Girls({
  weight: "400",
  subsets: ["latin"],
});

gsap.registerPlugin(ScrollTrigger);

// TODO
// Fix Storage

export default function Home() {
  type Image = {
    id: string;
    url: string;
    path: string;
  };

  const [images, setImages] = useState<Image[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const mask =
    process.env.NODE_ENV === "production"
      ? "/collage-portfolio/masks/corner-mask.svg"
      : "/masks/corner-mask.svg";

  async function handleFiles(files: FileList | null) {
    if (!files) return;

    for (const file of Array.from(files)) {
      const extension = file.name.split(".").pop();

      const path = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("scrapbook")
        .upload(path, file);

      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("scrapbook").getPublicUrl(path);

      const { error: dbError } = await supabase.from("images").insert({
        url: publicUrl,
        path,
      });

      if (dbError) {
        console.error(dbError);
      }
    }

    loadImages();
  }

  async function deleteImage(image: Image) {
    await supabase.storage.from("scrapbook").remove([image.path]);

    await supabase.from("images").delete().eq("id", image.id);

    loadImages();
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

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setImages(data);
  }

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
          - nicole's july highlights -
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
        {images.map((image) => (
          <div
            key={image}
            className="photo"
            style={{
              position: "relative",
              width: 250,
            }}
          >
            <img
              src={image.url}
              alt=""
              style={{
                WebkitMaskImage: `url(${mask})`,
                maskImage: `url(${mask})`,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
              }}
            />

            <button
              className="delete-button"
              onClick={() => deleteImage(image)}
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
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
