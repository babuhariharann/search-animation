import React from "react";

interface HighlightProps {
  text: string;
  highlight: string;
}

const Highlight: React.FC<HighlightProps> = ({ text, highlight }) => {
  if (!highlight.trim()) return <>{text}</>;

  const regex = new RegExp(`(${highlight})`, "gi");
  console.log("regex", regex);
  const parts = text.split(regex);
  console.log("parts", parts);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} style={{ background: "#ffe4c5" }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export default Highlight;
