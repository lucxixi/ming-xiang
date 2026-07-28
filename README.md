# Inner Space

一个面向零基础用户的轻量冥想工具。无需按课程学习，打开后可以直接完成一次练习。

## 当前练习

### 零基础入口

- **身体扫描**：约 3 分钟，从身体接触和部位感觉开始；任何区域都可以跳过。
- **自然呼吸**：约 3 分钟，不规定呼吸节奏；不舒服时可以切换到周围声音或眼前画面。

### 自由练习

- **烛火专注**：使用视觉锚点练习发现走神与返回，不计算专注分数。
- **念头云朵**：把一句念头暂时放到眼前观察，不把它当作必须服从的命令。
- **练习记录**：只在本机记录练习日期，不计算连续天数或发放成就。

## 产品边界

- 可以睁眼、暂停、换锚点或随时结束。
- 不要求清空大脑，不把走神定义为失败。
- 不承诺每次放松或带来医疗、心理治疗效果。
- Inner Space 是日常练习工具，不能替代医疗、心理治疗或现实中的安全行动。

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS + 自定义 CSS
- Lucide React
- Web Audio API
- `localStorage`

## 本地运行

```bash
npm install
npm run dev
```

## 音频资源

开发环境默认读取 `public/audio/`。正式发布时建议把音频和字幕放到支持 HTTPS、跨域、缓存及 Range 请求的对象存储／CDN，并配置：

```bash
VITE_MEDIA_BASE_URL=https://你的音频域名
```

CDN 中继续保持 `/audio/文件名` 路径。没有配置时自动使用本地资源，不影响开发。

发布前必须确认所有音频、音乐和图片具有公开使用授权。

## 页面地址

- `/practice/body-scan`
- `/practice/breathing/guided`
- `/practice/breathing/four-four`
- `/practice/guided/seated`
- `/practice/guided/lying`
- `/practice/thoughts`
- `/practice/history`

使用 History API 路由，生产服务器必须把未知页面路径回写到 `index.html`；仓库已包含 Vercel rewrite 配置。

## 检查

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

`npm audit --omit=dev` 应保持零生产依赖漏洞；开发工具漏洞需要在升级工具链时单独处理。
