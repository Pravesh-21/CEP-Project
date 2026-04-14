"use client"

import { useEffect, useState, useCallback } from "react"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)

interface MapSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void
  selectedLocation: { lat: number; lng: number } | null
}

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (location: { lat: number; lng: number }) => void
}) {
  const { useMapEvents } = require("react-leaflet")
  useMapEvents({
    click: (e: any) => {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })
  return null
}

export function MapSelector({
  onLocationSelect,
  selectedLocation,
}: MapSelectorProps) {
  const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 })
  const [locating, setLocating] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    setIsClient(true)
    // Fix Leaflet default icon issue in Next.js
    if (typeof window !== "undefined") {
      const L = require("leaflet")
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })
    }
  }, [])

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCenter = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        setCenter(newCenter)
        onLocationSelect(newCenter)
        setLocating(false)
        setMapKey((prev) => prev + 1) // Force map re-render
      },
      () => setLocating(false)
    )
  }, [onLocationSelect])

  const handleLocationSelect = useCallback(
    (location: { lat: number; lng: number }) => {
      onLocationSelect(location)
      setCenter(location)
    },
    [onLocationSelect]
  )

  if (!isClient) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-border bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const ClickHandler = () => {
    const { useMapEvents } = require("react-leaflet")
    useMapEvents({
      click: (e: any) => {
        handleLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        })
      },
    })
    return null
  }

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-3xl border-2 border-border/60 bg-card/60 backdrop-blur-md shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300">
        <div className="flex items-center justify-between border-b-2 border-border/60 bg-gradient-to-r from-card/50 to-card/30 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <MapPin className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-foreground">Location Selector</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLocate}
            disabled={locating}
            className="border-2 border-primary/40 text-primary hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10 hover:border-primary/60 shadow-md hover:shadow-lg transition-all duration-300 font-semibold rounded-xl hover:scale-105 active:scale-95"
          >
            {locating ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Navigation className="mr-1 h-3 w-3" />
            )}
            My Location
          </Button>
        </div>
        <div className="h-[400px] w-full">
          <MapContainer
            key={mapKey}
            center={[center.lat, center.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
            scrollWheelZoom={true}
            doubleClickZoom={true}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            )}
            <ClickHandler />
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
