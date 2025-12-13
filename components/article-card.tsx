import Link from "next/link"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ArticleCardProps {
  title: string
  date?: string
  excerpt?: string
  href?: string
  children?: React.ReactNode
  className?: string
}

export function ArticleCard({ title, date, excerpt, href, children, className }: ArticleCardProps) {
  const content = (
    <Card className={cn("p-6 hover:shadow-md transition-shadow", className)}>
      <div className="space-y-3">
        {date && (
          <time className="text-sm text-muted-foreground block">{date}</time>
        )}
        <h2 className={cn(
          "text-2xl font-normal",
          href && "hover:opacity-70 transition-opacity"
        )}>
          {href ? (
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        {excerpt && <p className="text-muted-foreground leading-relaxed">{excerpt}</p>}
        {children}
      </div>
    </Card>
  )

  return content
}

