import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { readFile } from "fs/promises"
import { join } from "path"

// Make this route dynamic so new posts work immediately
export const dynamic = 'force-dynamic'

async function getEssays() {
  try {
    const filePath = join(process.cwd(), "data", "writing.json")
    const fileContents = await readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const essays = await getEssays()
  const essay = essays.find((e: any) => e.slug === slug)

  if (!essay) {
    return {
      title: "Not Found",
    }
  }

  return {
    title: essay.title,
    description: essay.excerpt,
  }
}

export default async function EssayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const essays = await getEssays()
  const essay = essays.find((e: any) => e.slug === slug)

  if (!essay) {
    notFound()
  }

  return (
    <article>
      <header className="mb-8 pb-6 border-b border-foreground/10">
        <Link
          href="/writing"
          className="text-sm text-muted-foreground hover:opacity-60 transition-opacity mb-4 inline-block"
        >
          ← Back to Writing
        </Link>
        <h1 className="text-4xl font-normal mb-3">{essay.title}</h1>
        <time className="text-sm text-muted-foreground">{essay.date}</time>
      </header>
      <div className="prose prose-lg max-w-none">
        {essay.content.split("\n").map((paragraph: string, i: number) => {
          if (paragraph.startsWith("# ")) {
            return null // Skip title as it's already rendered
          }
          if (paragraph.trim() === "") {
            return <br key={i} />
          }
          // Handle markdown italic
          const parts = paragraph.split(/(\*[^*]+\*)/g)
          return (
            <p key={i} className="mb-4 text-lg leading-relaxed">
              {parts.map((part, j) => {
                if (part.startsWith("*") && part.endsWith("*")) {
                  return <em key={j}>{part.slice(1, -1)}</em>
                }
                return <span key={j}>{part}</span>
              })}
            </p>
          )
        })}
      </div>
    </article>
  )
}

// Removed generateStaticParams to allow dynamic content updates
