import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoModalProps {
  activeVideoIndex: number | null
  videos: { src: string; title: string }[]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function VideoModal({
  activeVideoIndex,
  videos,
  onClose,
  onPrev,
  onNext,
}: VideoModalProps) {
  if (activeVideoIndex === null) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors z-50"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={onPrev}
        className="absolute left-4 md:left-12 text-white/50 hover:text-white transition-colors z-50 p-2"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      <div className="w-full max-w-sm aspect-[9/16] bg-black relative rounded-xl overflow-hidden shadow-2xl">
        <video
          key={activeVideoIndex}
          src={videos[activeVideoIndex].src}
          className="w-full h-full object-cover"
          autoPlay
          controls
          playsInline
        />
      </div>

      <button
        onClick={onNext}
        className="absolute right-4 md:right-12 text-white/50 hover:text-white transition-colors z-50 p-2"
      >
        <ChevronRight className="w-10 h-10" />
      </button>
    </div>
  );
}
