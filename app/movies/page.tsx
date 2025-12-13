import { PageHeader } from "@/components/page-header"
import { readFile } from "fs/promises"
import { join } from "path"

async function getMovies() {
  try {
    const filePath = join(process.cwd(), "data", "movies.json")
    const fileContents = await readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

export default async function Movies() {
  const movies = await getMovies()

  return (
    <div>
      <PageHeader
        title="Movies"
        description="Films that have stayed with me, and thoughts on what they reveal about time, memory, and attention."
      />
      <div className="space-y-8">
        {movies.map((movie: any) => (
          <article key={movie.id} className="pb-8 border-b border-foreground/10 last:border-0">
            <h2 className="text-xl font-normal mb-1">{movie.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Directed by {movie.director}
              {movie.year && `, ${movie.year}`}
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">{movie.reflection}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

