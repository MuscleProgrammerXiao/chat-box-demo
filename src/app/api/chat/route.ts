import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    //     'HTTP-Referer': 'http://localhost:3000',
    //     'X-Title': 'My Chat App',
    //   },

     headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
     body: JSON.stringify({
        "model":"deepseek-ai/DeepSeek-V3",
        "messages":[{"role":"user","content":message}],
        "stream":false,
        "max_tokens":512,
        "stop":null,
        "temperature":0.7,
        "top_p":0.7,
        "top_k":50,
        "frequency_penalty":0.5,
        "n":1,
        "response_format":{"type":"text"},
        "tools":[{"type":"function","function":{"description":"<string>","name":"<string>","parameters":{},"strict":false}}]
    })
    //   body: JSON.stringify({
    //     model: 'deepseek/deepseek-coder', // 修改为 DeepSeek 模型
    //     messages: [
    //       { role: 'user', content: message },
    //     ],
    //   }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from OpenRouter');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ text: aiResponse });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}