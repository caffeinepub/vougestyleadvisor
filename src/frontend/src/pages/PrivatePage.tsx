import {
  getPrivateMedia,
  getPrivatePassword,
  seedPrivateMediaIfEmpty,
} from "@/lib/firebase";
import type { PrivateMediaItem } from "@/lib/firebase";
import { Lock, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "privateGallery_unlocked";

export default function PrivatePage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {unlocked ? (
        <GalleryView />
      ) : (
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      )}
    </div>
  );
}

// ─── Password Gate ────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const correctPasswordRef = useRef("");

  useEffect(() => {
    getPrivatePassword()
      .then((pw) => {
        correctPasswordRef.current = pw;
      })
      .finally(() => setChecking(false));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading || checking) return;
      setLoading(true);
      setError("");

      await new Promise((r) => setTimeout(r, 400));

      if (password === correctPasswordRef.current) {
        sessionStorage.setItem(SESSION_KEY, "true");
        onUnlock();
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
      setLoading(false);
    },
    [password, loading, checking, onUnlock],
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      data-ocid="private.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Lock icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full border border-[#c9a86a]/30 flex items-center justify-center bg-[#c9a86a]/5">
            <Lock className="w-8 h-8 text-[#c9a86a]" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold mb-3 tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#f5f1eb",
            }}
          >
            Private Gallery
          </h1>
          <p
            className="text-sm tracking-widest uppercase"
            style={{ color: "#888", fontFamily: "'Poppins', sans-serif" }}
          >
            This page is password protected
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              data-ocid="private.input"
              className="w-full bg-[#161616] border border-[#2a2a2a] rounded-none px-5 py-4 text-[#f5f1eb] placeholder-[#555] focus:outline-none focus:border-[#c9a86a]/60 transition-colors text-sm tracking-wider"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-rose-400 px-1"
                data-ocid="private.error_state"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || checking || !password}
            data-ocid="private.submit_button"
            className="w-full py-4 bg-[#c9a86a] text-[#0a0a0a] text-sm font-semibold tracking-widest uppercase transition-all hover:bg-[#d4b87a] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>

        {/* Decorative line */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#1e1e1e]" />
          <span
            className="text-[#333] text-xs tracking-widest uppercase"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            ✦
          </span>
          <div className="flex-1 h-px bg-[#1e1e1e]" />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Gallery View ─────────────────────────────────────────────────────────────

function GalleryView() {
  const [media, setMedia] = useState<PrivateMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<PrivateMediaItem | null>(null);
  const [activeImage, setActiveImage] = useState<PrivateMediaItem | null>(null);

  useEffect(() => {
    seedPrivateMediaIfEmpty()
      .then(() => getPrivateMedia())
      .then(setMedia)
      .finally(() => setLoading(false));
  }, []);

  // Close modals on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
        setActiveImage(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0e0c0b" }}>
      {/* Header */}
      <header className="px-6 py-8 border-b border-[#1e1c1a]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#f5f1eb",
              }}
            >
              Private Gallery
            </h1>
            <p
              className="text-xs tracking-widest uppercase mt-1"
              style={{ color: "#666", fontFamily: "'Poppins', sans-serif" }}
            >
              {media.length} {media.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full border border-[#c9a86a]/20 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-[#c9a86a]/60" />
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div
            className="flex justify-center items-center h-64"
            data-ocid="private.loading_state"
          >
            <div className="w-6 h-6 border-2 border-[#c9a86a]/30 border-t-[#c9a86a] rounded-full animate-spin" />
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-24" data-ocid="private.empty_state">
            <p
              className="text-[#555] text-sm tracking-widest uppercase"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              No content yet
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {media.map((item, index) => (
              <MediaCard
                key={item.id}
                item={item}
                index={index + 1}
                onImageClick={() => setActiveImage(item)}
                onVideoClick={() => setActiveVideo(item)}
              />
            ))}
          </motion.div>
        )}
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {activeImage && (
          <ImageLightbox
            item={activeImage}
            onClose={() => setActiveImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Media Card ───────────────────────────────────────────────────────────────

function MediaCard({
  item,
  index,
  onImageClick,
  onVideoClick,
}: {
  item: PrivateMediaItem;
  index: number;
  onImageClick: () => void;
  onVideoClick: () => void;
}) {
  const ocid = `private.item.${index}`;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
    >
      <button
        type="button"
        data-ocid={ocid}
        onClick={item.type === "video" ? onVideoClick : onImageClick}
        className="group relative w-full overflow-hidden cursor-pointer bg-[#151311] border border-[#1e1c1a] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 focus:outline-none focus:ring-2 focus:ring-[#c9a86a]/40"
        style={{ aspectRatio: index % 3 === 0 ? "3/4" : "4/3" }}
      >
        {item.type === "image" ? (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <VideoThumbnail url={item.url} />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play icon for videos */}
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#c9a86a]/90 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
              <Play
                className="w-5 h-5 text-[#0a0a0a] ml-0.5"
                fill="currentColor"
              />
            </div>
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p
            className="text-xs text-[#f5f1eb] tracking-wide truncate"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {item.title}
          </p>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span
            className="text-[9px] tracking-widest uppercase px-2 py-1 bg-[#0a0a0a]/70 text-[#c9a86a] border border-[#c9a86a]/20"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {item.type}
          </span>
        </div>
      </button>
    </motion.div>
  );
}

// ─── Video Thumbnail ──────────────────────────────────────────────────────────

function VideoThumbnail({ url }: { url: string }) {
  return (
    <div className="w-full h-full relative bg-[#1a1714]">
      <video
        src={url}
        className="w-full h-full object-cover opacity-60"
        muted
        preload="metadata"
        playsInline
      >
        <track kind="captions" />
      </video>
    </div>
  );
}

// ─── Video Modal ──────────────────────────────────────────────────────────────

function VideoModal({
  item,
  onClose,
}: {
  item: PrivateMediaItem;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
      data-ocid="private.modal"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          data-ocid="private.close_button"
          aria-label="Close video"
          className="absolute -top-10 right-0 text-[#888] hover:text-[#f5f1eb] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Player */}
        <div className="bg-[#0a0a0a] border border-[#1e1e1e] shadow-2xl shadow-black overflow-hidden">
          <video
            ref={videoRef}
            src={item.url}
            controls
            playsInline
            className="w-full max-h-[70vh] bg-black"
            style={{ display: "block" }}
          >
            <track kind="captions" />
          </video>
          <div className="px-5 py-3 border-t border-[#1a1a1a]">
            <p
              className="text-sm text-[#c9a86a] tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.title}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────

function ImageLightbox({
  item,
  onClose,
}: {
  item: PrivateMediaItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.95)" }}
      onClick={onClose}
      data-ocid="private.modal"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          data-ocid="private.close_button"
          aria-label="Close image"
          className="absolute -top-10 right-0 text-[#888] hover:text-[#f5f1eb] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={item.url}
          alt={item.title}
          className="w-full max-h-[80vh] object-contain shadow-2xl"
        />

        <div className="mt-3 text-center">
          <p
            className="text-sm text-[#c9a86a]/80 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.title}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
