import { FileCodeIcon, XIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/styles/base-rhea/ui/attachment"
import { Spinner } from "@/styles/base-rhea/ui/spinner"

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

export default function AttachmentDemo() {
  return (
    <div dir="rtl" className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <AttachmentGroup>
        {images.map((image) => (
          <Attachment key={image.name} orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={image.src} alt={image.alt} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{image.name}</AttachmentTitle>
              <AttachmentDescription>{image.meta}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>داشبورد-فروش.pdf</AttachmentTitle>
          <AttachmentDescription>در حال آپلود · ۶۴٪</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="لغو آپلود">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment className="w-full">
        <AttachmentMedia>
          <FileCodeIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · ۱۲ کیلوبایت</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="حذف message-renderer.tsx">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  )
}
