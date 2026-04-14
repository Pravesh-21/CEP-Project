"use client"

import { useState } from "react"
import { QrCode, Download, Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function QRGenerator() {
  const [text, setText] = useState("")
  const [qrUrl, setQrUrl] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!text.trim()) {
      toast.error("Please enter text to generate QR code")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/qr/${encodeURIComponent(text)}`)
      const data = await res.json()
      setQrUrl(data.qr)
      toast.success("QR code generated!")
    } catch {
      toast.error("Failed to generate QR code")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl)
      toast.success("QR URL copied to clipboard")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          QR Generator
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate QR codes for donation tracking
        </p>
      </div>

      <div className="max-w-lg space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="qr-text" className="text-sm text-foreground">
            Text or URL
          </Label>
          <Input
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter donation ID, URL, or any text"
            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate()
            }}
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <QrCode className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Generate QR Code"}
        </Button>
      </div>

      {qrUrl && (
        <div className="max-w-lg rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="overflow-hidden rounded-lg border border-border bg-foreground p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl || "/placeholder.svg"}
                alt="Generated QR code"
                width={200}
                height={200}
                className="block"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy URL
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                <a href={qrUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
