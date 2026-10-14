"use client"

import * as React from "react"
import { cn } from "cn"

export type DragScrollProps = React.ComponentProps<"div"> & {
  /** Scroll orientation (default horizontal). */
  orientation?: "horizontal" | "vertical"
  /** Show thin scrollbar (default hidden). */
  showScrollbar?: boolean
}

/**
 * Overflow container with touch scroll + mouse click-drag pan.
 * Ideal for chip rows, card carousels, and galleries.
 */
function DragScroll({
  className,
  children,
  orientation = "horizontal",
  showScrollbar = false,
  ...props
}: DragScrollProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const drag = React.useRef<{
    active: boolean
    startX: number
    startY: number
    scrollLeft: number
    scrollTop: number
    moved: boolean
  }>({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    moved: false,
  })

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const el = ref.current
    if (!el) return
    // Prefer native touch scrolling; drag-pan is for mouse / pen.
    if (e.pointerType === "touch") return

    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
      moved: false,
    }
    el.setPointerCapture(e.pointerId)
    el.dataset.dragging = "true"
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    const state = drag.current
    if (!el || !state.active) return

    const dx = e.clientX - state.startX
    const dy = e.clientY - state.startY
    if (Math.abs(dx) + Math.abs(dy) > 3) state.moved = true

    if (orientation === "horizontal") {
      el.scrollLeft = state.scrollLeft - dx
    } else {
      el.scrollTop = state.scrollTop - dy
    }
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    const state = drag.current
    if (!el || !state.active) return
    state.active = false
    delete el.dataset.dragging
    try {
      el.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent accidental link/button clicks after a drag.
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  return (
    <div
      ref={ref}
      data-slot="drag-scroll"
      data-orientation={orientation}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      className={cn(
        "relative max-w-full overscroll-x-contain",
        orientation === "horizontal"
          ? "overflow-x-auto overflow-y-hidden"
          : "overflow-y-auto overflow-x-hidden",
        "cursor-grab active:cursor-grabbing data-[dragging=true]:cursor-grabbing",
        "touch-pan-x select-none",
        !showScrollbar &&
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { DragScroll }
