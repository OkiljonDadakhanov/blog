import { PageHeader } from "@/components/page-header"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <PageHeader
        title="Welcome"
        description="A space for quiet thinking—a collection of essays, fragments, reading notes, and quotes that have shaped my understanding."
      />
      <div className="space-y-6">
        <p className="text-lg leading-relaxed">
          The site is intentionally simple. No distractions, no analytics, just words and ideas arranged for careful
          reading.
        </p>
        <div className="flex gap-4 pt-4">
          <Link href="/writing" className="text-sm underline hover:opacity-60 transition-opacity">
            Browse Writing →
          </Link>
          <Link href="/reading" className="text-sm underline hover:opacity-60 transition-opacity">
            See Reading →
          </Link>
        </div>
      </div>
    </div>
  )
}
