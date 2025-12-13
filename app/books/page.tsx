import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import { readFile } from "fs/promises"
import { join } from "path"

async function getBooks() {
  try {
    const filePath = join(process.cwd(), "data", "books.json")
    const fileContents = await readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

export default async function Books() {
  const books = await getBooks()

  return (
    <div>
      <PageHeader
        title="Books"
        description="Books I return to, and longer reflections on what they mean to me."
      />
      <div className="space-y-8">
        {books.map((book: any) => (
          <article key={book.slug} className="pb-8 border-b border-foreground/10 last:border-0">
            <time className="text-sm text-muted-foreground block mb-2">{book.date}</time>
            <h2 className="text-2xl font-normal mb-3">
              <Link href={`/books/${book.slug}`} className="hover:opacity-60 transition-opacity">
                {book.title}
              </Link>
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              {book.author}
              {book.year && `, ${book.year}`}
            </p>
            {book.excerpt && <p className="text-muted-foreground leading-relaxed">{book.excerpt}</p>}
          </article>
        ))}
      </div>
    </div>
  )
}
