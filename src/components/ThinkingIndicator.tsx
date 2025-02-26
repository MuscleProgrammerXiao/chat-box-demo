"use client";
import { Avatar, ListItem, ListItemText, Stack } from "@mui/material";
import { keyframes, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

const dotPulse = keyframes`
  0%, 20% { opacity: 0; }
  40% { opacity: 1; }
  60%, 100% { opacity: 0; }
`;

const AnimatedText = styled("span")({
  display: "flex",
  alignItems: "center",
  gap: 2,
  "& .dot": {
    animation: `${dotPulse} 1.5s infinite`,
    "&:nth-of-type(2)": { animationDelay: "0.2s" },
    "&:nth-of-type(3)": { animationDelay: "0.4s" },
  },
});

interface ThinkingIndicatorProps {
  isThinking: boolean;
  position?: "left" | "right";
  avatarColor?: string;
}

export default function ThinkingIndicator({
  isThinking,
  position = "left",
  avatarColor = "#d81b60",
}: ThinkingIndicatorProps) {
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    let animationFrame: number;

    if (isThinking) {
      setStartTime(Date.now());
      const update = () => {
        setElapsedTime((Date.now() - startTime) / 1000);
        animationFrame = requestAnimationFrame(update);
      };
      animationFrame = requestAnimationFrame(update);
    } else {
      setElapsedTime(0);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isThinking, startTime]);

  if (!isThinking) return null;

  return (
    <ListItem
      sx={{ justifyContent: position === "left" ? "flex-start" : "flex-end" }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          flexDirection: position === "left" ? "row" : "row-reverse",
        }}
      >
        <Avatar sx={{ bgcolor: avatarColor }}>AI</Avatar>
        <ListItemText
          primary={
            <AnimatedText>
              {`AI 正在思考 (${elapsedTime.toFixed(1)}s)`}
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </AnimatedText>
          }
          sx={{
            background: "#f5f5f5",
            padding: "8px",
            borderRadius: "8px",
            maxWidth: "70%",
          }}
        />
      </Stack>
    </ListItem>
  );
}
