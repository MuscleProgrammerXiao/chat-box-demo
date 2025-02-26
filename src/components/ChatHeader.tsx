"use client";
import { Box, Button, Stack } from "@mui/material";
import { ReactNode } from "react";

interface ChatHeaderProps {
  title?: ReactNode;
  onNewChat?: () => void;
  onClearChat?: () => void;
  isProcessing?: boolean;
}

export default function ChatHeader({
  title = "聊天机器人",
  onNewChat,
  onClearChat,
  isProcessing = false,
}: ChatHeaderProps) {
  return (
    <Box
      sx={{
        padding: "16px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{title}</span>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          onClick={() => {
            if (isProcessing) {
              alert("请等待当前操作完成");
              return;
            }
            onNewChat?.();
          }}
          sx={{ textTransform: "none" }}
          disabled={isProcessing}
        >
          新对话
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            if (isProcessing) {
              alert("请等待当前操作完成");
              return;
            }
            onClearChat?.();
          }}
          sx={{ textTransform: "none" }}
          disabled={isProcessing}
        >
          清空记录
        </Button>
      </Stack>
    </Box>
  );
}
