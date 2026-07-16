"use client";

import { useRef, useState } from "react";
import { Crafty_Girls } from "next/font/google";

const craftyGirls = Crafty_Girls({
  weight: "400",
  subsets: ["latin"],
});

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

  return (
    <main style={{ padding: 32 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h1 style={{fontSize: '2rem'}}className={craftyGirls.className}>nicole's girly scrapbook</h1>

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
        capture="environment"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        style={{
          marginTop: 30,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 50,
        }}
      >
        {images.map((src, i) => (
          <div key={i} className="collage">
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
