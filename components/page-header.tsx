import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="mb-12">
      <h1 className="text-4xl font-normal mb-4">{title}</h1>
      {description && <p className="text-lg text-muted-foreground mb-6">{description}</p>}
      {children}
    </header>
  )
}

