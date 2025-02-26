"use client";
import { Avatar, Box, Button, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isAiThinking, setAiThinking] = useState(false);
  const chatHistoryRef = useRef<HTMLElement>(null);

  const handleSubmit = async () => {
    if (!inputText || isAiThinking) return;
  
    // 创建临时历史副本（避免状态更新延迟问题）
    const tempHistory = [...chatHistory, { sender: 'user', text: inputText }];
    setChatHistory(tempHistory);
    setInputText('');
    setAiThinking(true);
  
    try {
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-wvfqxsgomujqhzlqqfeuswgxtadukxtilygrihzmrbnvxscs',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'My Chat App',
        },
        body: JSON.stringify({
          "model": "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
          "messages": [
            {
              role: "system",
              content: "你是一个专业的AI助手，请用中文进行自然流畅的多轮对话"
            },
            ...tempHistory
              .slice(-4) // 保留最近3轮对话+当前消息（根据模型token限制调整）
              .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
              })),
            { role: 'user', content: inputText }
          ],
          "stream": false,
          "max_tokens": 512,
          "temperature": 0.7
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API请求失败');
      }
  
      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || '无法生成回复';
      
      // 更新历史时需要包含AI的回复
      setChatHistory(prev => [...prev, { sender: 'assistant', text: aiResponse }]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setChatHistory(prev => [...prev, {
        sender: 'assistant',
        text: `出错啦: ${errorMessage}`
      }]);
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