import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import { readFile } from "fs/promises"
import { join } from "path"
import Image from "next/image"

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book: any) => (
          <Link
            key={book.slug}
            href={`/books/${book.slug}`}
            className="group"
          >
            <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-sm border border-foreground/10 hover:border-foreground/30 transition-all hover:shadow-lg">
              {book.image ? (
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-xs text-muted-foreground italic line-clamp-3">{book.title}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium mb-1 group-hover:opacity-60 transition-opacity line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {book.author}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
