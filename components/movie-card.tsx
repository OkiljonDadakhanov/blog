import { Card } from "@/components/ui/card"

interface MovieCardProps {
  title: string
  director: string
  year?: string
  reflection: string
}

export function MovieCard({ title, director, year, reflection }: MovieCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-normal mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Directed by {director}
            {year && `, ${year}`}
          </p>
        </div>
        <p className="leading-relaxed text-muted-foreground">{reflection}</p>
      </div>
    </Card>
  )
}

