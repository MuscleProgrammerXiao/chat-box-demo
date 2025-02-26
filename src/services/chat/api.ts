// API 实现请求
import { ChatCompletionRequest, ChatCompletionResponse, APIError } from './types';

const API_ENDPOINT = 'https://api.siliconflow.cn/v1/chat/completions';

export const createChatCompletion = async (
  params: ChatCompletionRequest
): Promise<ChatCompletionResponse> => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer sk-wvfqxsgomujqhzlqqfeuswgxtadukxtilygrihzmrbnvxscs`, // 
      'HTTP-Referer':'http://localhost:3000',
      'X-Title': 'My Chat App',
    },
    body: JSON.stringify({
      model: 'Pro/deepseek-ai/DeepSeek-V3',
      temperature: 0.7,
      max_tokens: 512,
      stream: false,
      ...params,
    }),
  });

  if (!response.ok) {
    const errorData: APIError = await response.json();
    throw new Error(errorData.error.message || 'API request failed');
  }

  return response.json();
};
