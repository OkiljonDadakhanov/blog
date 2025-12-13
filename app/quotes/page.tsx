import { PageHeader } from "@/components/page-header"
import { readFile } from "fs/promises"
import { join } from "path"

async function getQuotes() {
  try {
    const filePath = join(process.cwd(), "data", "quotes.json")
    const fileContents = await readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

export default async function Quotes() {
  const quotes = await getQuotes()

  return (
    <div>
      <PageHeader
        title="Quotes"
        description="Words from others that I carry with me."
      />
      <div className="space-y-8">
        {quotes.map((quote: any) => (
          <article key={quote.id} className="pb-8 border-b border-foreground/10 last:border-0">
            <blockquote className="text-lg italic mb-4 leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <p className="text-sm text-muted-foreground">
              — {quote.source}
              {quote.context && `, ${quote.context}`}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
