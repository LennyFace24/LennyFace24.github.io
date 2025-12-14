import MarkdownIt from 'markdown-it'

import { parseFrontMatter } from '../utils/frontMatter'

export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  tags: string[]
}

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

type PostFrontMatter = Pick<Post, 'slug' | 'title' | 'excerpt' | 'date' | 'tags'>

const modules = import.meta.glob('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function toPost([path, raw]: [string, unknown]): Post {
  const source = typeof raw === 'string' ? raw : ''
  const { data, content } = parseFrontMatter<PostFrontMatter>(source)
  const filename = path.split('/').pop() || 'post'
  const slug = (data.slug as string) ?? filename.replace(/\.md$/, '')
  const title = (data.title as string) ?? slug
  const excerpt = (data.excerpt as string) ?? content.slice(0, 120).trim()
  const date = (data.date as string) ?? new Date().toISOString().slice(0, 10)
  const tags = Array.isArray(data.tags)
    ? (data.tags as unknown[]).map((tag) => String(tag))
    : []

  return {
    slug,
    title,
    excerpt,
    date,
    tags,
    content: md.render(content),
  }
}

const posts: Post[] = Object.entries(modules)
  .map(toPost)
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export default posts
