# HeoWeb 设计架构与借鉴指南

这份指南从“设计架构”和“组件实现”两个维度对 HeoWeb 进行了拆解，你可以直接复制其中的代码片段应用到你的 Hexo 博客中。

## 1. 设计架构分析 (Architecture Analysis)

HeoWeb 的设计核心在于**“感官一致性”**，通过以下三个技术手段实现：

1.  **CSS 变量原子化 (Design Tokens)**:
    不直接使用颜色值（如 `#4375ff`），而是定义语义化的变量（如 `--heo-theme`）。这样只需修改根变量，全站主题色瞬间切换。
2.  **拟态与悬浮感 (Glassmorphism & Elevation)**:
    利用 `backdrop-filter` 实现磨砂玻璃，配合多层级的 `box-shadow` 营造元素悬浮在背景之上的 3D 空间感。
3.  **微交互 (Micro-interactions)**:
    几乎所有可点击元素都有 `:hover` 状态的位移或缩放，配合 `transition`，让网页“活”起来。

---

## 2. 核心样式代码借鉴 (Style Copy-Paste)

### 2.1 根变量定义 (Root Variables)
将这些变量添加到你的 CSS `:root` 中，奠定基调。

```css
:root {
  /* 核心主题色 - 蓝色系 */
  --heo-theme: #4375ff;
  --heo-theme-op: rgba(67, 117, 255, 0.14); /* 主题色淡背景 */
  
  /* 基础板式 */
  --heo-background: #f5f5f7; /* 苹果风浅灰背景 */
  --heo-card-bg: #fff;       /* 卡片纯白 */
  --heo-fontcolor: #00001e;  /* 深蓝黑色字体，比纯黑更有质感 */
  
  /* 阴影系统 (灵魂所在) */
  --heo-shadow-border: 0 8px 16px -4px rgba(44, 45, 48, 0.05);
  --heo-shadow-lightblack: 0 5px 12px -5px rgba(102, 68, 68, 0.05);
  --heo-shadow-theme: 0 8px 12px -3px var(--heo-theme-op);
  
  /* 边框 */
  --style-border: 1px solid #e3e8f7;
  --style-border-hover: 1px solid var(--heo-theme);
}
```

### 2.2 磨砂玻璃导航栏 (Frosted Glass Nav)
这种导航栏在滚动时会模糊背后的内容。

```css
.nav-bar {
  background: rgba(255, 255, 255, 0.8); /* 半透明白 */
  backdrop-filter: blur(12px);          /* 核心：高斯模糊 */
  -webkit-backdrop-filter: blur(12px);  /* 兼容 Safari */
  border-bottom: 1px solid rgba(255,255,255,0.5);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
}
```

### 2.3 悬浮卡片效果 (Hover Card)
卡片默认平铺，鼠标悬停时上浮并加深阴影。

```css
.card {
  background: var(--heo-card-bg);
  border: var(--style-border);
  border-radius: 12px;
  transition: all 0.3s ease-in-out; /* 平滑过渡 */
}

/* 悬停态：边框变色 + 上浮 + 投影 */
.card:hover {
  border: var(--style-border-hover);
  transform: translateY(-5px); /* 向上位移 */
  box-shadow: var(--heo-shadow-theme);
}
```

### 2.4 呼吸感悬浮动画 (Floating Animation)
用于 Hero Section 的主图或插画，让其看起来像悬浮在空中。

```css
@keyframes floating {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); } /* 上下浮动 10px */
  100% { transform: translateY(0); }
}

.floating-img {
  animation: floating 4s ease-in-out infinite; /* 无限循环 */
}
```

### 2.5 胶囊按钮 (Pill Button)
HeoWeb 中常见的圆润按钮。

```css
.pill-btn {
  background: var(--heo-theme);
  color: #fff;
  border-radius: 50px; /* 大圆角 */
  padding: 8px 24px;
  font-size: 14px;
  font-weight: bold;
  transition: filter 0.3s;
}

.pill-btn:hover {
  filter: brightness(1.2); /* 悬停亮度增加 */
}
```

---

## 3. 结构布局借鉴 (Layout Patterns)

### 3.1 英雄区 (Hero Section)
左侧文案 + 右侧 3D 图片的经典布局。

```html
<div class="hero-section" style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 100px 20px;">
  <div class="left-text">
    <h1 style="font-size: 60px; color: var(--heo-fontcolor);">大标题文案</h1>
    <p style="font-size: 24px; opacity: 0.8;">副标题或简介描述</p>
    <a href="#" class="pill-btn">开始探索</a>
  </div>
  <div class="right-img">
    <!-- 应用上面的悬浮动画 -->
    <img src="banner.png" class="floating-img" style="width: 400px;">
  </div>
</div>
```

### 3.2 响应式网格 (Responsive Grid)
用于展示文章或项目，PC 端三列，平板两列，手机一列。

```css
.grid-container {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 20px;       /* 间距 */
}

.grid-item {
  width: calc(33.33% - 20px); /* PC端：一行三个 */
}

@media screen and (max-width: 768px) {
  .grid-item {
    width: 100%; /* 手机端：一行一个 */
  }
}
```

## 4. 总结与建议

HeoWeb 的设计之所以好看，不是因为某个单一技术，而是因为**克制**和**细节**：
1.  **克制颜色**：全站主色仅用一个蓝色，其他都是黑白灰的变体。
2.  **注重细节**：阴影不是纯黑，而是带有一点点蓝色的透明度 (`rgba(40, 109, 234, 0.2)`)，这让阴影看起来更通透“高级”。
