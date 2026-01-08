'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Maximize,
  RotateCcw,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface KidsVideoPlayerProps {
  videoUrl: string
  thumbnailUrl?: string
  title: string
  onComplete?: () => void
  onProgress?: (progress: number) => void
}

export const KidsVideoPlayer = ({
  videoUrl,
  thumbnailUrl,
  title,
  onComplete,
  onProgress,
}: KidsVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return

    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
    setProgress(currentProgress)
    onProgress?.(currentProgress)

    // Mark as complete when 90% watched
    if (currentProgress >= 90 && !showCompletionOverlay) {
      setShowCompletionOverlay(true)
      onComplete?.()
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = clickPosition * videoRef.current.duration
  }

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds)
    )
  }

  const handleMuteToggle = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    if (!containerRef.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }

  const handleReplay = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setIsPlaying(true)
    setShowCompletionOverlay(false)
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-3xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        poster={thumbnailUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false)
          setShowCompletionOverlay(true)
        }}
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Big Play Button (when paused) */}
      {!isPlaying && !showCompletionOverlay && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <Play className="w-12 h-12 text-blue-500 ml-2" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Progress Bar */}
        <div
          className="w-full h-3 bg-white/30 rounded-full mb-4 cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg" />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={() => handleSkip(-10)}
            >
              <SkipBack className="w-7 h-7" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-full w-16 h-16"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-10 h-10" fill="currentColor" />
              ) : (
                <Play className="w-10 h-10 ml-1" fill="currentColor" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={() => handleSkip(10)}
            >
              <SkipForward className="w-7 h-7" />
            </Button>
          </div>

          {/* Center - Time */}
          <div className="text-white font-bold text-lg">
            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={handleMuteToggle}
            >
              {isMuted ? (
                <VolumeX className="w-7 h-7" />
              ) : (
                <Volume2 className="w-7 h-7" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={handleFullscreen}
            >
              <Maximize className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </div>

      {/* Completion Overlay */}
      {showCompletionOverlay && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 flex flex-col items-center justify-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold mb-2">Great job!</h2>
          <p className="text-xl mb-6">You finished watching!</p>
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className="w-10 h-10 text-yellow-300 animate-pulse"
                fill="currentColor"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg font-semibold"
              onClick={handleReplay}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Watch Again
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
