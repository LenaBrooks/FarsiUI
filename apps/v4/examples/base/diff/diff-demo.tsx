import { Diff, DiffItem1, DiffItem2, DiffResizer } from "@/registry/bases/base/ui/diff"

export default function DiffDemo() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Diff className="aspect-video w-full rounded-lg">
        <DiffItem1>
          <img alt="اصفهان" src="/farsiui/isfahan.jpg" />
        </DiffItem1>
        <DiffItem2>
          <img
            alt="اصفهان تار"
            src="/farsiui/isfahan.jpg"
            className="scale-105 blur-sm"
          />
        </DiffItem2>
        <DiffResizer />
      </Diff>
    </div>
  )
}
