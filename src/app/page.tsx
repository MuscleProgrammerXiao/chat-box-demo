"use client";
import { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import {
  createChatCompletion,
  MessageRole,
  type ChatMessage,
} from "@/services/chat";

import ThinkingIndicator from "@/components/ThinkingIndicator";
import TypewriterText from "@/components/TypewriterText";
import ChatHeader from "@/components/ChatHeader";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Home() {
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: string; text: string; isTyping: boolean }>
  >([]);
  const [inputText, setInputText] = useState<string>("");
  const [isAiThinking, setAiThinking] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    open: boolean;
    content: string;
    onConfirm: () => void;
  }>({
    open: false,
    content: "",
    onConfirm: () => {},
  });
  const chatHistoryRef = useRef<HTMLElement>(null);

  const handleSubmit = async () => {
    if (!inputText || isAiThinking) return;
    const tempHistory = [
      ...chatHistory,
      { sender: "user", text: inputText, isTyping: false },
    ];
    setChatHistory(tempHistory);
    setInputText("");
    setAiThinking(true);
    try {
      // 构建消息
      const messages: ChatMessage[] = [
        {
          role: "system",
          content: "你是一个专业的AI助手，请用中文进行自然流畅的多轮对话",
        },
        ...tempHistory.slice(-4).map((msg) => ({
          role: (msg.sender === "user" ? "user" : "assistant") as MessageRole,
          content: msg.text,
        })),
        { role: "user" as MessageRole, content: inputText },
      ];
      // 调用服务
      const data = await createChatCompletion({ messages });
      const aiResponse = data.choices[0].message.content;

      setChatHistory((prev) => [
        ...prev,
        { sender: "assistant", text: aiResponse, isTyping: true },
      ]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: `出错啦: ${errorMessage}`,
          isTyping: false,
        },
      ]);
    } finally {
      setAiThinking(false);
    }
  };

  const handleTypeComplete = (index: number) => {
    setChatHistory((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, isTyping: false } : msg))
    );
  };

  const handleClearChat = () => {
    if (isAiThinking) {
      alert("请等待当前对话完成后再清空");
      return;
    }
    setDialogConfig({
      open: true,
      content: "确定要清空所有聊天记录吗？此操作不可撤销。",
      onConfirm: () => {
        setChatHistory([]);
        setDialogConfig((prev) => ({ ...prev, open: false }));
      },
    });
  };
  const handleNewChat = () => {
    if (isAiThinking) {
      alert("请等待当前对话完成后再开始新对话");
      return;
    }
    setChatHistory([]);
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <ChatHeader
        isProcessing={isAiThinking}
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
      />
      <Box ref={chatHistoryRef} sx={{ flex: 1, overflow: "auto" }}>
        <List>
          {chatHistory.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  flexDirection:
                    message.sender === "user" ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.sender === "user" ? "#1976d2" : "#d81b60",
                  }}
                >
                  {message.sender === "user" ? "U" : "A"}
                </Avatar>
                <ListItemText
                  primary={
                    message.sender === "assistant" && message.isTyping ? (
                      <TypewriterText
                        text={message.text}
                        speed={30}
                        onComplete={() => handleTypeComplete(index)}
                      />
                    ) : (
                      message.text
                    )
                  }
                  sx={{
                    background:
                      message.sender === "user" ? "#e0e0e0" : "#f5f5f5",
                    padding: "8px",
                    borderRadius: "8px",
                    maxWidth: "70%",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                />
              </Stack>
            </ListItem>
          ))}
          <ThinkingIndicator
            isThinking={isAiThinking}
            position="left"
            avatarColor="#d81b60"
          />
        </List>
      </Box>
      <Stack direction="row" spacing={1} sx={{ padding: "16px" }}>
        <TextField
          value={inputText}
          multiline
          minRows={1}
          maxRows={4}
          variant="outlined"
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          sx={{ flex: 1 }}
          placeholder="输入你的消息..."
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit}>
          发送
        </Button>
      </Stack>
      <ConfirmDialog
        open={dialogConfig.open}
        title="操作确认"
        content={dialogConfig.content}
        onConfirm={dialogConfig.onConfirm}
        onCancel={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
