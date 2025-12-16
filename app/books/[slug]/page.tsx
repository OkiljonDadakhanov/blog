import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { readFile } from "fs/promises"
import { join } from "path"

// Make this route dynamic so new posts work immediately
export const dynamic = 'force-dynamic'

async function getBooks() {
  try {
    const filePath = join(process.cwd(), "data", "books.json")
    const fileContents = await readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const books = await getBooks()
  const book = books.find((b: any) => b.slug === slug)

  if (!book) {
    return {
      title: "Not Found",
    }
  }

  return {
    title: book.title,
    description: book.excerpt,
  }
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const books = await getBooks()
  const book = books.find((b: any) => b.slug === slug)

  if (!book) {
    notFound()
  }

  return (
    <article>
      <header className="mb-8 pb-6 border-b border-foreground/10">
        <Link
          href="/books"
          className="text-sm text-muted-foreground hover:opacity-60 transition-opacity mb-4 inline-block"
        >
          ← Back to Books
        </Link>
        <h1 className="text-4xl font-normal mb-3">{book.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <p>
            {book.author}
            {book.year && `, ${book.year}`}
          </p>
          {book.date && <time>{book.date}</time>}
        </div>
      </header>
      <div className="prose prose-lg max-w-none">
        {book.content.split("\n").map((paragraph: string, i: number) => {
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



