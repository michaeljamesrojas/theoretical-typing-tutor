import React, { useState, useEffect } from "react";

export default function TypingIndicator({ toDisplay }) {
  const [growClass, setGrowClass] = useState("growFade");

  useEffect(() => {
    setGrowClass("growFade");
  }, [toDisplay]);

  return (
    <h1
      id="growFade"
      className={`my-auto start-0 position-absolute text-center fw-bolder w-100 ${growClass}`}
      style={{ top: "25%" }}
    >
      {toDisplay}
    </h1>
  );
}
