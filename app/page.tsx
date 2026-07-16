"use client";

import { useRef, useState } from "react";

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prev) => [...prev, ...newImages]);
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>My Collages</h1>

      <button onClick={() => inputRef.current?.click()}>
        Upload Images
      </button>

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
          gap: 20,
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              width: "100%",
              borderRadius: 12,
              objectFit: "cover",
            }}
          />
        ))}
      </div>
    </main>
  );
}