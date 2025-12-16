import { PageHeader } from "@/components/page-header"
import { readFile } from "fs/promises"
import { join } from "path"

async function getAbout() {
  try {
    const filePath = join(process.cwd(), "data", "about.json")
    const fileContents = await readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    return {
      content: "I'm a writer and reader interested in attention, slowness, and the way language shapes thought.",
      email: "okiljondadakhonov@gmail.com",
    }
  }
}

export default async function About() {
  const about = await getAbout()
  const paragraphs = about.content.split("\n\n")

  return (
    <div>
      <PageHeader title="About" />
      <div className="space-y-6">
        {paragraphs.map((paragraph: string, i: number) => (
          <p key={i} className="text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
        <p className="text-lg leading-relaxed">
          If you'd like to get in touch, you can reach me at{" "}
          <a href={`mailto:${about.email}`} className="underline hover:opacity-60 transition-opacity">
            {about.email}
          </a>
        </p>
      </div>
    </div>
  )
}
