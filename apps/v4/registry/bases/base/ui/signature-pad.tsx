"use client"

import * as React from "react"
import { EraserIcon, RotateCcwIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/registry/bases/base/ui/button"

export type SignaturePadHandle = {
  clear: () => void
  undo: () => void
  isEmpty: () => boolean
  toDataURL: (type?: string) => string | null
  toSvg: () => string | null
}

export type SignaturePadProps = {
  className?: string
  width?: number
  height?: number
  strokeWidth?: number
  strokeColor?: string
  backgroundColor?: string
  disabled?: boolean
  onEnd?: (dataUrl: string | null) => void
  showActions?: boolean
}

type Point = { x: number; y: number }

const SignaturePad = React.forwardRef<SignaturePadHandle, SignaturePadProps>(
  function SignaturePad(
    {
      className,
      width = 480,
      height = 200,
      strokeWidth = 2.25,
      strokeColor = "currentColor",
      backgroundColor = "transparent",
      disabled,
      onEnd,
      showActions = true,
    },
    ref
  ) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const drawing = React.useRef(false)
    const strokes = React.useRef<Point[][]>([])
    const current = React.useRef<Point[]>([])
    const [empty, setEmpty] = React.useState(true)

    const getCtx = React.useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const ctx = canvas.getContext("2d")
      if (!ctx) return null
      return { canvas, ctx }
    }, [])

    const redraw = React.useCallback(() => {
      const pair = getCtx()
      if (!pair) return
      const { ctx } = pair
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)
      }
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth

      for (const stroke of strokes.current) {
        if (stroke.length < 2) continue
        ctx.beginPath()
        ctx.moveTo(stroke[0]!.x, stroke[0]!.y)
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i]!.x, stroke[i]!.y)
        }
        ctx.stroke()
      }
    }, [backgroundColor, getCtx, height, strokeColor, strokeWidth, width])

    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      redraw()
    }, [height, redraw, width])

    const pointFromEvent = (
      e: React.PointerEvent<HTMLCanvasElement>
    ): Point => {
      const canvas = canvasRef.current!
      const rect = canvas.getBoundingClientRect()
      return {
        x: ((e.clientX - rect.left) / rect.width) * width,
        y: ((e.clientY - rect.top) / rect.height) * height,
      }
    }

    const emit = React.useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas || strokes.current.length === 0) {
        onEnd?.(null)
        return
      }
      onEnd?.(canvas.toDataURL("image/png"))
    }, [onEnd])

    const clear = React.useCallback(() => {
      strokes.current = []
      current.current = []
      setEmpty(true)
      redraw()
      onEnd?.(null)
    }, [onEnd, redraw])

    const undo = React.useCallback(() => {
      strokes.current.pop()
      setEmpty(strokes.current.length === 0)
      redraw()
      emit()
    }, [emit, redraw])

    const toDataURL = React.useCallback(
      (type: string = "image/png") => {
        if (strokes.current.length === 0 || !canvasRef.current) return null
        return canvasRef.current.toDataURL(type)
      },
      []
    )

    const toSvg = React.useCallback(() => {
      if (strokes.current.length === 0) return null
      const paths = strokes.current
        .filter((s) => s.length > 1)
        .map((stroke) => {
          const d = stroke
            .map(
              (p, i) =>
                `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
            )
            .join(" ")
          return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`
        })
        .join("")
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${paths}</svg>`
    }, [height, strokeWidth, width])

    React.useImperativeHandle(
      ref,
      () => ({
        clear,
        undo,
        isEmpty: () => strokes.current.length === 0,
        toDataURL,
        toSvg,
      }),
      [clear, toDataURL, toSvg, undo]
    )

    const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (disabled) return
      e.currentTarget.setPointerCapture(e.pointerId)
      drawing.current = true
      current.current = [pointFromEvent(e)]
    }

    const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current || disabled) return
      current.current.push(pointFromEvent(e))
      const pair = getCtx()
      if (!pair || current.current.length < 2) return
      const { ctx } = pair
      const a = current.current[current.current.length - 2]!
      const b = current.current[current.current.length - 1]!
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }

    const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return
      drawing.current = false
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
      if (current.current.length) {
        strokes.current.push(current.current)
        current.current = []
        setEmpty(false)
        emit()
      }
    }

    return (
      <div
        className={cn("flex w-full flex-col gap-2", className)}
        dir="rtl"
        lang="fa"
        data-empty={empty || undefined}
      >
        <div className="overflow-hidden rounded-xl border bg-background">
          <canvas
            ref={canvasRef}
            className={cn(
              "block w-full max-w-full touch-none text-foreground",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-crosshair"
            )}
            style={{ height }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-label="محدوده امضا"
          />
        </div>
        {showActions ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || empty}
              onClick={undo}
            >
              <RotateCcwIcon className="size-3.5" />
              بازگشت
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || empty}
              onClick={clear}
            >
              <EraserIcon className="size-3.5" />
              پاک کردن
            </Button>
          </div>
        ) : null}
      </div>
    )
  }
)

export { SignaturePad }
