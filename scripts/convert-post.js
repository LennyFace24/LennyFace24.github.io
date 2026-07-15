/**
 * convert-post.js — 将任意 Markdown 文件转换为 Fuwari 博客格式
 *
 * 用法:
 *   pnpm convert-post <source-md-path> [选项]
 *   pnpm convert-post <source-directory> [选项]
 *
 * 选项:
 *   --title <text>         文章标题 (默认: 文件名或第一个 # 标题)
 *   --date <YYYY-MM-DD>    发布日期 (默认: 文件修改日期)
 *   --tags <text>          标签, 逗号分隔 (e.g. "tech,web")
 *   --category <text>      分类
 *   --slug <text>          自定义 slug (默认: 文件名)
 *   --lang <text>          语言代码 (e.g. zh_CN, en)
 *   --draft                标记为草稿
 *   --description <text>   文章描述
 *   --image <path>         封面图片路径 (相对输出目录)
 *
 * 示例:
 *   pnpm convert-post ~/notes/my-article.md --tags "tech,react" --category "Front-end"
 *   pnpm convert-post ~/notes/my-project/ --slug my-project-slug
 *
 * 行为:
 *   - 解析源文件的 frontmatter (如果有) 作为默认值
 *   - CLI 选项覆盖 frontmatter 中的值
 *   - 自动检测并复制本地图片到输出目录
 *   - 无图 → 生成单文件 posts/{slug}.md
 *   - 有图 → 生成目录 posts/{slug}/index.md + 图片
 */

import fs from "node:fs";
import path from "node:path";

// ==================== Argument Parsing ====================

const args = process.argv.slice(2);

function printUsage() {
	console.error(`Usage: pnpm convert-post <source-md-path> [options]

Options:
  --title <text>         Article title (default: filename or first # heading)
  --date <YYYY-MM-DD>    Publish date (default: file modification date)
  --tags <text>          Comma-separated tags (e.g. "tech,web")
  --category <text>      Category
  --slug <text>          Custom slug (default: basename of source)
  --lang <text>          Language code (e.g. zh_CN, en)
  --draft                Mark as draft
  --description <text>   Article description
  --image <path>         Cover image path (relative to output directory)

Examples:
  pnpm convert-post ~/notes/my-article.md --tags "tech,react" --category "Front-end"
  pnpm convert-post ~/notes/my-project/ --slug my-project-slug
`);
	process.exit(1);
}

if (args.length === 0) printUsage();

const sourcePath = path.resolve(args[0]);
const opts = {};

for (let i = 1; i < args.length; i++) {
	switch (args[i]) {
		case "--title":
			opts.title = args[++i];
			break;
		case "--date":
			opts.date = args[++i];
			break;
		case "--tags":
			opts.tags = args[++i];
			break;
		case "--category":
			opts.category = args[++i];
			break;
		case "--slug":
			opts.slug = args[++i];
			break;
		case "--lang":
			opts.lang = args[++i];
			break;
		case "--draft":
			opts.draft = true;
			break;
		case "--description":
			opts.description = args[++i];
			break;
		case "--image":
			opts.image = args[++i];
			break;
		default:
			console.error(`Unknown option: ${args[i]}`);
			process.exit(1);
	}
}

// ==================== Source Resolution ====================

if (!fs.existsSync(sourcePath)) {
	console.error(`Error: Source not found: ${sourcePath}`);
	process.exit(1);
}

let sourceDir;
let sourceFile;

if (fs.statSync(sourcePath).isDirectory()) {
	sourceDir = sourcePath;
	sourceFile = path.join(sourcePath, "index.md");
	if (!fs.existsSync(sourceFile)) {
		console.error(`Error: No index.md found in directory ${sourcePath}`);
		process.exit(1);
	}
} else {
	sourceDir = path.dirname(sourcePath);
	sourceFile = sourcePath;
}

const sourceContent = fs.readFileSync(sourceFile, "utf-8");
const sourceExt = path.extname(sourceFile).toLowerCase();

// ==================== Frontmatter Parsing ====================

function parseFrontmatter(content) {
	const result = { body: content, fm: {} };
	const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!match) return result;

	result.body = content.slice(match[0].length);
	const fmText = match[1];

	let currentKey = null;
	let inArray = false;
	let arrayAccum = [];

	for (const rawLine of fmText.split("\n")) {
		const line = rawLine.trim();
		if (!line) continue;

		if (inArray) {
			if (line.startsWith("- ")) {
				arrayAccum.push(line.slice(2).trim());
				continue;
			}
			if (line === "]") {
				result.fm[currentKey] = arrayAccum;
				currentKey = null;
				inArray = false;
				arrayAccum = [];
				continue;
			}
			continue;
		}

		const colonIdx = line.indexOf(":");
		if (colonIdx === -1) continue;

		const key = line.slice(0, colonIdx).trim();
		let val = line.slice(colonIdx + 1).trim();

		if (val === "") {
			currentKey = key;
			continue;
		}

		// Handle inline array [...]
		if (val.startsWith("[") && val.endsWith("]")) {
			val = val.slice(1, -1).trim();
			if (val) {
				result.fm[key] = val
					.split(",")
					.map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
			} else {
				result.fm[key] = [];
			}
			continue;
		}

		// Handle multi-line array start
		if (val.startsWith("[") && !val.endsWith("]")) {
			currentKey = key;
			inArray = true;
			const inner = val.slice(1).trim();
			arrayAccum = inner
				? inner.split(",").map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
				: [];
			continue;
		}

		// Strip quotes
		val = val.replace(/^['"]|['"]$/g, "");
		if (val === "true") val = true;
		else if (val === "false") val = false;

		result.fm[key] = val;
	}

	// Handle unclosed array at end of frontmatter
	if (inArray && currentKey) {
		result.fm[currentKey] = arrayAccum;
	}

	return result;
}

const { fm: existingFm, body } = parseFrontmatter(sourceContent);

// ==================== Title Extraction ====================

function extractTitleFromBody(content) {
	const match = content.match(/^#\s+(.+)$/m);
	return match ? match[1].trim() : null;
}

// ==================== Date Helpers ====================
// getTodayStr intentionally omitted; getFileDateStr below is the primary date source

function getFileDateStr(filePath) {
	const d = fs.statSync(filePath).mtime;
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ==================== Build Frontmatter ====================

// Priority: CLI opts > existing frontmatter > auto-detect
const title =
	opts.title ||
	existingFm.title ||
	extractTitleFromBody(body) ||
	path.basename(sourceFile, path.extname(sourceFile));
const published = opts.date || existingFm.published || existingFm.date || getFileDateStr(sourceFile);
const description =
	opts.description !== undefined
		? opts.description
		: existingFm.description || "";
const tags = opts.tags
	? opts.tags
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean)
	: existingFm.tags || [];
const category =
	opts.category !== undefined ? opts.category : existingFm.category || "";
const lang = opts.lang !== undefined ? opts.lang : existingFm.lang || "";
const draft =
	opts.draft !== undefined ? opts.draft : existingFm.draft || false;
const coverImage =
	opts.image !== undefined ? opts.image : existingFm.image || "";

const localImages = new Set();

// Match markdown image syntax: ![alt](path)
const mdImgRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
for (;;) {
	const m = mdImgRe.exec(body);
	if (m === null) break;
	const imgPath = m[2].trim();
	if (
		!imgPath.startsWith("http://") &&
		!imgPath.startsWith("https://") &&
		!imgPath.startsWith("data:")
	) {
		localImages.add(imgPath);
	}
}

// Match HTML <img> tags
const htmlImgRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
for (;;) {
	const m = htmlImgRe.exec(body);
	if (m === null) break;
	const imgPath = m[1].trim();
	if (
		!imgPath.startsWith("http://") &&
		!imgPath.startsWith("https://") &&
		!imgPath.startsWith("data:")
	) {
		localImages.add(imgPath);
	}
}

const hasImages = localImages.size > 0;

// ==================== Slug ====================

const baseName = path.basename(sourceFile, sourceExt);
let slug = opts.slug || baseName;
// Sanitize: replace non-alphanumeric (except Chinese, hyphens, underscores) with hyphens
slug = slug
	.replace(/[^a-zA-Z0-9\u4e00-\u9fff\-_]/g, "-")
	.replace(/-+/g, "-")
	.replace(/^-|-$/g, "");

// ==================== Output Path ====================

const targetRoot = path.resolve("./src/content/posts");
let outputDir;
let outputFile;

if (hasImages) {
	outputDir = path.join(targetRoot, slug);
	outputFile = path.join(outputDir, "index.md");
} else {
	outputDir = targetRoot;
	outputFile = path.join(targetRoot, `${slug}.md`);
}

if (fs.existsSync(outputFile)) {
	console.error(`Error: Output already exists: ${outputFile}`);
	process.exit(1);
}

// ==================== Format Frontmatter Values ====================

function fmVal(v) {
	if (typeof v === "boolean") return v ? "true" : "false";
	if (Array.isArray(v)) {
		if (v.length === 0) return "[]";
		const items = v.map((s) => {
			const str = String(s).trim();
			return /[ :'"]/.test(str) ? `'${str.replace(/'/g, "\\'")}'` : str;
		});
		return `[${items.join(", ")}]`;
	}
	const s = String(v);
	if (s === "") return "''";
	// Quote if contains special YAML chars
	if (/[:#{}[\]&*!|>%@`"'\\]/.test(s) || s.includes(", ")) {
		return `'${s.replace(/'/g, "\\'")}'`;
	}
	return s;
}

// ==================== Build Final Content ====================

const fmLines = [
	"---",
	`title: ${fmVal(title)}`,
	`published: ${published}`,
	`description: ${fmVal(description)}`,
	`image: ${fmVal(coverImage)}`,
	`tags: ${fmVal(tags)}`,
	`category: ${fmVal(category)}`,
	`draft: ${fmVal(draft)}`,
];
if (lang) fmLines.push(`lang: ${fmVal(lang)}`);
fmLines.push("---\n");

const fullContent = fmLines.join("\n") + body;

// ==================== Copy Images ====================

if (hasImages) {
	fs.mkdirSync(outputDir, { recursive: true });

	for (const imgRelPath of localImages) {
		// Resolve relative to source directory
		const imgSource = path.resolve(sourceDir, imgRelPath);
		const imgDest = path.join(outputDir, path.basename(imgRelPath));

		if (fs.existsSync(imgSource)) {
			fs.copyFileSync(imgSource, imgDest);
			console.log(`  \u2713 Copied: ${path.basename(imgRelPath)}`);
		} else {
			console.warn(`  \u26a0 Not found: ${imgRelPath}`);
		}
	}

	// Also copy any extra image files in the source directory
	if (fs.statSync(sourcePath).isDirectory()) {
		for (const file of fs.readdirSync(sourceDir)) {
			if (file === "index.md") continue;
			const ext = path.extname(file).toLowerCase();
			if ([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp"].includes(ext)) {
				const destPath = path.join(outputDir, file);
				if (!fs.existsSync(destPath)) {
					fs.copyFileSync(path.join(sourceDir, file), destPath);
					console.log(`  \u2713 Copied extra: ${file}`);
				}
			}
		}
	}
} else {
	fs.mkdirSync(targetRoot, { recursive: true });
}

// ==================== Write Output ====================

fs.writeFileSync(outputFile, fullContent, "utf-8");

console.log(`\n\u2713 Converted: ${outputFile}`);
console.log(`  Title: ${title}`);
console.log(`  Published: ${published}`);
console.log(`  Tags: ${tags.length ? tags.join(", ") : "(none)"}`);
console.log(`  Category: ${category || "(none)"}`);
console.log(`  Images: ${localImages.size}`);