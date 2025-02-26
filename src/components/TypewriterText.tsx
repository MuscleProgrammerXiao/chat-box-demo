"use client";
import { keyframes, styled } from "@mui/material";
import { ReactNode } from "react";
import { useEffect, useState } from "react";

const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const TypewriterContainer = styled("div")({
  display: "inline-block",
  position: "relative",
  "&::after": {
    content: '"|"',
    animation: `${cursorBlink} 1s step-end infinite`,
    marginLeft: "2px",
  },
});

interface TypewriterTextProps {
  text: string;
  speed?: number; // 字符/秒
  onComplete?: () => void;
  render?: (text: string) => ReactNode; // 新增渲染函数
}

export default function TypewriterText({
  text,
  speed = 20,
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= text.length) {
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, 1000 / speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, onComplete]);

  return <TypewriterContainer>{displayText}</TypewriterContainer>;
}
