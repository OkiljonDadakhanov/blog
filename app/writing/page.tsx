import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import { readFile } from "fs/promises"
import { join } from "path"

async function getEssays() {
  try {
    const filePath = join(process.cwd(), "data", "writing.json")
    const fileContents = await readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

export default async function Writing() {
  const essays = await getEssays()

  return (
    <div>
      <PageHeader
        title="Writing"
        description="Essays and longer-form thoughts on attention, reading, and the craft of writing."
      />
      <div className="space-y-8">
        {essays.map((essay: any) => (
          <article key={essay.slug} className="pb-8 border-b border-foreground/10 last:border-0">
            <time className="text-sm text-muted-foreground block mb-2">{essay.date}</time>
            <h2 className="text-2xl font-normal mb-3">
              <Link href={`/writing/${essay.slug}`} className="hover:opacity-60 transition-opacity">
                {essay.title}
              </Link>
            </h2>
            {essay.excerpt && <p className="text-muted-foreground leading-relaxed">{essay.excerpt}</p>}
          </article>
        ))}
      </div>
    </div>
  )
}
