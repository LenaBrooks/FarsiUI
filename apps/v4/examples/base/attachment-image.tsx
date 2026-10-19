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
} from "@/styles/base-rhea/ui/attachment"

const images = [
  {
    name: "فضای-کار.png",
    meta: "PNG · ۸۲۰ کیلوبایت",
    src: "/images/components/01.avif",
    alt: "فضای کار",
  },
  {
    name: "میز-کار.jpg",
    meta: "JPG · ۱٫۱ مگابایت",
    src: "/images/components/02.avif",
    alt: "میز کار",
  },
  {
    name: "دفتر.jpg",
    meta: "JPG · ۹۴۰ کیلوبایت",
    src: "/images/components/03.avif",
    alt: "دفتر",
  },
]

export default function AttachmentImage() {
  return (
    <div dir="rtl" className="mx-auto w-full max-w-sm">
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
              <AttachmentAction aria-label={`حذف ${image.name}`}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
            <AttachmentTrigger
              render={
                <a
                  href={image.src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`باز کردن ${image.name}`}
                />
              }
            />
          </Attachment>
        ))}
      </AttachmentGroup>
    </div>
  )
}
