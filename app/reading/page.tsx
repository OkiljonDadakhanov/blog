import { PageHeader } from "@/components/page-header"
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

export default async function Reading() {
  const books = await getBooks()

  return (
    <div>
      <PageHeader
        title="Reading"
        description="Books I return to, and notes on what they mean to me."
      />
      <div className="space-y-8">
        {books.map((book: any) => (
          <article key={book.id} className="pb-8 border-b border-foreground/10 last:border-0">
            <h2 className="text-xl font-normal italic mb-1">{book.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {book.author}
              {book.year && `, ${book.year}`}
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">{book.reflection}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
