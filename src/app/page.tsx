"use client";
import { Avatar, Box, Button, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isAiThinking, setAiThinking] = useState(false);
  const chatHistoryRef = useRef<HTMLElement>(null);

  const handleSubmit = async () => {
    if (!inputText) return;

    // 添加用户消息
    setChatHistory(prev => [...prev, { sender: 'user', text: inputText }]);
    setInputText('');
    setAiThinking(true);

    try {
      // 调用 API 路由
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, { sender: 'assistant', text: data.text }]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory(prev => [...prev, { sender: 'assistant', text: 'Sorry, something went wrong.' }]);
    } finally {
      setAiThinking(false);
    }
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>与 AI 聊天</Box>
      <Box ref={chatHistoryRef} sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {chatHistory.map((message, index) => (
            <ListItem key={index} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexDirection: message.sender === 'user' ? 'row-reverse' : 'row' }}
              >
                <Avatar sx={{ bgcolor: message.sender === 'user' ? '#1976d2' : '#d81b60' }}>
                  {message.sender === 'user' ? 'U' : 'A'}
                </Avatar>
                <ListItemText
                  primary={message.text}
                  sx={{
                    background: message.sender === 'user' ? '#e0e0e0' : '#f5f5f5',
                    padding: '8px',
                    borderRadius: '8px',
                    maxWidth: '70%',
                  }}
                />
              </Stack>
            </ListItem>
          ))}
          {isAiThinking && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#d81b60' }}>A</Avatar>
                <ListItemText
                  primary="AI 正在思考..."
                  sx={{ background: '#f5f5f5', padding: '8px', borderRadius: '8px', maxWidth: '70%' }}
                />
              </Stack>
            </ListItem>
          )}
        </List>
      </Box>
      <Stack direction="row" spacing={1} sx={{ padding: '16px' }}>
        <TextField
          value={inputText}
          multiline
          minRows={1}
          maxRows={4}
          variant="outlined"
          fullWidth
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          sx={{ flex: 1 }}
          placeholder="输入你的消息..."
          onChange={e => setInputText(e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit}>发送</Button>
      </Stack>
    </Box>
  );
}