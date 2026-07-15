# 博客转换器 — `convert-post` CLI 使用文档

## 概述

`convert-post` 是一个命令行工具，用于**将任意 Markdown 文件转换为 Fuwari 博客格式**，并自动将生成的文档**复制到 `src/content/posts/` 目录**中。

支持识别和复制本地图片、保留或覆盖原 Frontmatter、目录模式等，让你无需手动调整格式即可快速迁移外部笔记或文章。

## 基本用法

```bash
pnpm convert-post <source> [选项]
```

`<source>` 可接受：

- **单个 Markdown 文件** — `pnpm convert-post ~/notes/my-article.md`
- **一个目录** — `pnpm convert-post ~/notes/my-project/`（目录内须包含 `index.md`）

## 示例

### 1. 转换单篇文件

```bash
pnpm convert-post ~/Documents/学习笔记.md \
  --tags "go,并发" \
  --category devLife \
  --lang zh_CN
```

- 输出：`src/content/posts/学习笔记.md`
- 自动从文件名或正文 `# 标题` 提取标题
- 自动从文件修改日期提取 `published` 字段

### 2. 转换带图片的文章目录

```bash
pnpm convert-post ~/Documents/my-article/ \
  --slug article-with-images \
  --title "我的文章"
```

假设目录结构如下：

```
~/Documents/my-article/
├── index.md
├── image.png
├── screenshot.png
└── diagram-1.png
```

输出：

```
src/content/posts/article-with-images/
├── index.md
├── image.png
├── screenshot.png
└── diagram-1.png
```

图片引用路径保持不变（`![](./image.png)`），无需手动修改。

### 3. 覆盖 Frontmatter

假设源文件已有 Frontmatter：

```yaml
---
title: 旧标题
date: 2025-01-01
tags: [old]
category: old
draft: true
---
```

运行：

```bash
pnpm convert-post ~/notes/old-article.md --title "新标题" --draft --tags "new,updated"
```

生成的 Frontmatter：

```yaml
---
title: 新标题             # CLI 选项覆盖原有值
published: 2025-01-01    # 保留（来自 date 字段）
tags: [new, updated]     # 覆盖
category: old            # 保留
draft: true              # --draft 覆盖
---
```

## 选项参考

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `--title` | `string` | 文件名 / 正文首个 `#` 标题 | 文章标题 |
| `--date` | `YYYY-MM-DD` | 文件修改日期 | 发布日期 |
| `--tags` | `string`（逗号分隔） | 源 Frontmatter 中的 tags | 标签 |
| `--category` | `string` | 源 Frontmatter 中的 category | 分类 |
| `--slug` | `string` | 源文件名（不含扩展名） | URL slug，决定输出路径 |
| `--lang` | `string` | 源 Frontmatter 中的 lang | 语言代码（`zh_CN`, `en`, `ja` 等） |
| `--draft` | `boolean` | 源 Frontmatter 中的 draft | 标记为草稿 |
| `--description` | `string` | 源 Frontmatter 中的 description | 文章描述 |
| `--image` | `string` | 源 Frontmatter 中的 image | 封面图片路径（相对博客 `posts/` 目录） |

> **优先级：CLI 选项 > 源文件 Frontmatter > 自动推断**

## 输出规则

| 场景 | 输出路径 | 示例 |
|---|---|---|
| **无本地图片** | `src/content/posts/{slug}.md` | `posts/go-notes.md` |
| **有本地图片** | `src/content/posts/{slug}/index.md` + 图片 | `posts/go-notes/index.md` + `image.png` |

## 图片处理

脚本**自动检测**源文件中的图片引用：

- Markdown 语法：`![alt](./image.png)`
- HTML 标签：`<img src="./photo.jpg">`

本地图片（非 `http://` / `https://` / `data:` 开头）会被复制到输出目录。引用路径（`./image.png`）保持不变，无需修改图片引用。

如果源是目录，除了 `index.md` 外还会自动复制该目录下所有常见图片格式文件（`.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.bmp`）。

## 配合 `new-post` 使用

| 命令 | 用途 |
|---|---|
| `pnpm new-post <filename>` | 创建一篇全新的空白文章 |
| `pnpm convert-post <source>` | 从外部 Markdown 文件导入已有内容 |

## 常见问题

### Q: 输出文件已存在会怎样？

脚本会报错退出，不会覆盖已有文件。如需覆盖请手动删除旧文件后重新运行。

### Q: 源文件中的 Frontmatter 会被修改吗？

不会。脚本只读取源文件的 Frontmatter 用于默认值，源文件本身不会被修改。

### Q: 引用路径以 `./` 开头的图片能识别吗？

可以。`./image.png` 和 `image.png` 都会被正确检测和复制。