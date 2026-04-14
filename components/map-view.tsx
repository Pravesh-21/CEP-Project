"use client"

import React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MapView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 })
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([])
  const [locating, setLocating] = useState(false)

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    // Dark map background
    ctx.fillStyle = "#0d1117"
    ctx.fillRect(0, 0, w, h)

    // Grid lines
    ctx.strokeStyle = "#1a2332"
    ctx.lineWidth = 1
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, h)
      ctx.stroke()
    }
    for (let j = 0; j < h; j += 40) {
      ctx.beginPath()
      ctx.moveTo(0, j)
      ctx.lineTo(w, j)
      ctx.stroke()
    }

    // Center marker
    const cx = w / 2
    const cy = h / 2
    ctx.fillStyle = "#10b981"
    ctx.beginPath()
    ctx.arc(cx, cy, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, 16, 0, Math.PI * 2)
    ctx.stroke()

    // Label
    ctx.fillStyle = "#e2e8f0"
    ctx.font = "12px system-ui"
    ctx.textAlign = "center"
    ctx.fillText(
      `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`,
      cx,
      cy - 24
    )

    // Extra markers
    markers.forEach((m, i) => {
      const mx = cx + (m.lng - center.lng) * 200
      const my = cy - (m.lat - center.lat) * 200
      ctx.fillStyle = "#38bdf8"
      ctx.beginPath()
      ctx.arc(mx, my, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#94a3b8"
      ctx.font = "10px system-ui"
      ctx.fillText(`Pin ${i + 1}`, mx, my - 10)
    })
  }, [center, markers])

  useEffect(() => {
    drawMap()
  }, [drawMap])

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const lng = center.lng + (x - cx) / 200
    const lat = center.lat - (y - cy) / 200

    setMarkers((prev) => [...prev, { lat, lng }])
  }

  function handleLocate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Map View</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Click on the map to drop pins for donation locations
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-foreground">
              Location Mapping
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {markers.length} pin{markers.length !== 1 ? "s" : ""} dropped
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleLocate}
              disabled={locating}
              className="border-border text-foreground hover:bg-secondary bg-transparent"
            >
              {locating ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Navigation className="mr-1 h-3 w-3" />
              )}
              My Location
            </Button>
            {markers.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMarkers([])}
                className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onClick={handleCanvasClick}
          className="w-full cursor-crosshair"
          style={{ display: "block" }}
        />
      </div>
    </div>
  )
}
