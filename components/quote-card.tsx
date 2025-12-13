import { Card } from "@/components/ui/card"

interface QuoteCardProps {
  text: string
  source: string
  context?: string
}

export function QuoteCard({ text, source, context }: QuoteCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <blockquote className="text-lg italic mb-4 leading-relaxed">
        &ldquo;{text}&rdquo;
      </blockquote>
      <p className="text-sm text-muted-foreground">
        — {source}
        {context && `, ${context}`}
      </p>
    </Card>
  )
}

