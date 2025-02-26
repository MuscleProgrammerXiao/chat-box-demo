## 启动项目

1.进入项目目录

```bash
cd my-app
```

2.安装依赖

```bash
npm install
```

3.启动项目

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 实现思路

1.技术栈选择 react,nextjs,Material UI,typescript
2.AI工具 deepSpeek grok
2.实现过程：要做一个类似chatgpt的聊天机器人，考虑到最小可行性的原则，用ai快速构建出了前端页面。
连接模型时，由于公司网络问题，选择了接入deepSeek V3的模型。第一次做此类型的功能。在调用模型时遇到了问题，
在查阅相关文档后一一解决。
3.功能拓展：
 3.1.由于模型返回结果时间较长，加入了耗时loading动画，以提升用户体验。
 3.2 加入了历史记录功能。每次都会都能结合上下文。并设置token最大长度。
 3.3 加入了ai展示结果时打字机效果。
 3.4 加入了清空对话，新建聊天对话功能。

## 问题与不足

由于当前参与的公司项目主要以create-react-app,JavaScript为主。typescript，nextjs作为个人兴趣学习，深入
得比较少，考虑到该项目适合服务端渲染，所以选择了nextjs。但是我的开发经验告诉我工作大部分是业务驱动代码，
所以我认为有快速学习能力适合公司的技术要求比盲目追求新技术更重要。

