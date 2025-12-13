import { PageHeader } from "@/components/page-header"
import { readFile } from "fs/promises"
import { join } from "path"

async function getNotes() {
  try {
    const filePath = join(process.cwd(), "data", "notes.json")
    const fileContents = await readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

export default async function Notes() {
  const notes = await getNotes()

  return (
    <div>
      <PageHeader
        title="Notes"
        description="Brief thoughts, fragments, and observations—unpolished and unfinished."
      />
      <div className="space-y-8">
        {notes.map((note: any) => (
          <article key={note.id} className="pb-8 border-b border-foreground/10 last:border-0">
            <time className="text-sm text-muted-foreground block mb-3">{note.date}</time>
            <p className="text-lg leading-relaxed">{note.content}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
