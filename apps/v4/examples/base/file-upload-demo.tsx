"use client"

import { FileUpload } from "@/registry/bases/base/ui/file-upload"

export default function FileUploadDemo() {
  return (
    <div className="w-full max-w-md p-4">
      <FileUpload
        id="upload"
        accept="image/*,.pdf"
        maxSize={2 * 1024 * 1024}
      />
    </div>
  )
}
