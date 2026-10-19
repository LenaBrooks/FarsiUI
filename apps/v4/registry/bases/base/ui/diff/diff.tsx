"use client"

import * as React from "react"
import { cn } from "cn"

type DiffContextValue = {
  position: number
  setPosition: (value: number) => void
  containerRef: React.RefObject<HTMLElement | null>
}

const DiffContext = React.createContext<DiffContextValue | null>(null)

function useDiff() {
  const context = React.useContext(DiffContext)
  if (!context) {
    throw new Error("Diff components must be used within <Diff>.")
  }
  return context
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

/** Direct child layout — mirrors daisyUI `.diff-item-* > *`. */
const itemChildClassName =
  "[&>*]:pointer-events-none [&>*]:absolute [&>*]:inset-y-0 [&>*]:left-0 [&>*]:h-full [&>*]:w-[100cqi] [&>*]:max-w-none [&>img]:object-cover [&>img]:object-center [&>video]:object-cover [&>video]:object-center"

function Diff({
  className,
  children,
  defaultValue = 50,
  value,
  onValueChange,
  onKeyDown,
  ...props
}: React.ComponentProps<"figure"> & {
  /** Uncontrolled initial position (0–100). */
  defaultValue?: number
  /** Controlled position (0–100). */
  value?: number
  onValueChange?: (value: number) => void
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const position = value ?? uncontrolled
  const containerRef = React.useRef<HTMLElement>(null)

  const setPosition = React.useCallback(
    (next: number) => {
      const clamped = clamp(next)
      if (value === undefined) setUncontrolled(clamped)
      onValueChange?.(clamped)
    },
    [onValueChange, value]
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const step = event.shiftKey ? 10 : 2
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      setPosition(position - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      setPosition(position + step)
    } else if (event.key === "Home") {
      event.preventDefault()
      setPosition(0)
    } else if (event.key === "End") {
      event.preventDefault()
      setPosition(100)
    }
  }

  return (
    <DiffContext.Provider value={{ position, setPosition, containerRef }}>
      <figure
        ref={containerRef as React.RefObject<HTMLElement>}
        data-slot="diff"
        data-diff-position={position}
        tabIndex={0}
        role="group"
        aria-label="مقایسهٔ دو مورد"
        onKeyDown={handleKeyDown}
        className={cn(
          "relative block w-full min-w-0 overflow-hidden select-none outline-none @container focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
        style={
          {
            direction: "ltr",
            "--diff-position": `${position}%`,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </figure>
    </DiffContext.Provider>
  )
}

function DiffItem1({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="diff-item-1"
      className={cn(
        "absolute inset-y-0 left-0 z-1 overflow-hidden border-r-2 border-background shadow-[0_0_0_2px_rgb(0_0_0/0.16)]",
        itemChildClassName,
        className
      )}
      style={{ width: "var(--diff-position)" }}
      {...props}
    >
      {children}
    </div>
  )
}

function DiffItem2({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="diff-item-2"
      className={cn("absolute inset-0", itemChildClassName, className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DiffResizer({ className, ...props }: React.ComponentProps<"div">) {
  const { position, setPosition, containerRef } = useDiff()
  const dragging = React.useRef(false)

  const updateFromClientX = React.useCallback(
    (clientX: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return
      setPosition(((clientX - rect.left) / rect.width) * 100)
    },
    [containerRef, setPosition]
  )

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    updateFromClientX(event.clientX)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    updateFromClientX(event.clientX)
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      data-slot="diff-resizer"
      role="slider"
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      aria-label="جابه‌جایی جداکننده"
      tabIndex={-1}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "absolute inset-y-0 z-2 w-3 -translate-x-1/2 cursor-ew-resize touch-none",
        "after:pointer-events-none after:absolute after:left-1/2 after:top-1/2 after:z-2 after:h-7 after:w-5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-2 after:border-background after:bg-background/95 after:shadow-[0_0_0_2px_rgb(0_0_0/0.16)] after:outline-2 after:outline-offset-[-3px] after:outline-foreground/10 after:transition-[height] after:duration-200 hover:after:h-9",
        className
      )}
      style={{ left: "var(--diff-position)" }}
      {...props}
    />
  )
}

export { Diff, DiffItem1, DiffItem2, DiffResizer }
