import { PageHeader } from "@/components/page-header"
import { readFile } from "fs/promises"
import { join } from "path"
import Image from "next/image"

async function getAbout() {
  try {
    const filePath = join(process.cwd(), "data", "about.json")
    const fileContents = await readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    return {
      content: "I'm a writer and reader interested in attention, slowness, and the way language shapes thought.",
      email: "okiljondadakhonov@gmail.com",
      image: "",
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
        {about.image && (
          <div className="relative w-full max-w-md aspect-square mx-auto mb-8">
            <Image
              src={about.image}
              alt="About"
              fill
              className="object-cover rounded-sm border border-foreground/10"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
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
