import { PageHeader } from "@/components/page-header"

export default function About() {
  return (
    <div>
      <PageHeader title="About" />
      <div className="space-y-6">
        <p className="text-lg leading-relaxed">
          I'm a writer and reader interested in attention, slowness, and the way language shapes thought.
        </p>
        <p className="text-lg leading-relaxed">
          This site is a public notebook—a place to gather essays, fragments, reading notes, and quotes that matter to me.
          It's built with the belief that some ideas need space to breathe, away from the noise of social media and the
          pressure of engagement metrics.
        </p>
        <p className="text-lg leading-relaxed">
          Everything here is written in Markdown and compiled into static HTML. No tracking, no analytics, no comments.
          Just words on a page.
        </p>
        <p className="text-lg leading-relaxed">
          If you'd like to get in touch, you can reach me at{" "}
          <a href="mailto:hello@example.com" className="underline hover:opacity-60 transition-opacity">
            hello@example.com
          </a>
        </p>
      </div>
    </div>
  )
}
