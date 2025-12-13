import { Card } from "@/components/ui/card"

interface BookCardProps {
  title: string
  author: string
  year?: string
  reflection: string
}

export function BookCard({ title, author, year, reflection }: BookCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-normal italic mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {author}
            {year && `, ${year}`}
          </p>
        </div>
        <p className="leading-relaxed text-muted-foreground">{reflection}</p>
      </div>
    </Card>
  )
}

