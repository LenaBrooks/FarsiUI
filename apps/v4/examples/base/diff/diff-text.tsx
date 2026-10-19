import { Diff, DiffItem1, DiffItem2, DiffResizer } from "@/registry/bases/base/ui/diff"

export default function DiffText() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Diff className="aspect-video w-full rounded-lg">
        <DiffItem1>
          <div className="grid place-content-center bg-primary text-[clamp(2rem,12vw,6rem)] font-black text-primary-foreground">
            FARSIUI
          </div>
        </DiffItem1>
        <DiffItem2>
          <div className="grid place-content-center bg-muted text-[clamp(2rem,12vw,6rem)] font-black text-foreground">
            FARSIUI
          </div>
        </DiffItem2>
        <DiffResizer />
      </Diff>
    </div>
  )
}
