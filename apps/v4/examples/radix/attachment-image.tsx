import { XIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/styles/radix-rhea/ui/attachment"

const images = [
  {
    name: "workspace.png",
    meta: "PNG · 820 KB",
    src: "/images/components/01.avif",
    alt: "Workspace",
  },
  {
    name: "desk-reference.jpg",
    meta: "JPG · 1.1 MB",
    src: "/images/components/02.avif",
    alt: "Desk",
  },
  {
    name: "office-reference.jpg",
    meta: "JPG · 940 KB",
    src: "/images/components/03.avif",
    alt: "Office",
  },
]

export default function AttachmentImage() {
  return (
    <div className="mx-auto w-full max-w-sm py-12">
      <AttachmentGroup className="w-full">
        {images.map((image) => (
          <Attachment key={image.name} orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={image.src} alt={image.alt} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{image.name}</AttachmentTitle>
              <AttachmentDescription>{image.meta}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={`Remove ${image.name}`}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
            <AttachmentTrigger asChild>
              <a
                href={image.src}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${image.name}`}
              />
            </AttachmentTrigger>
          </Attachment>
        ))}
      </AttachmentGroup>
    </div>
  )
}
