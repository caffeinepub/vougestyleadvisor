import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "@/lib/firebase";
import type { PrivateMediaItem } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { get, onValue, push, ref, remove, set } from "firebase/database";
import {
  Eye,
  EyeOff,
  Image,
  Loader2,
  Lock,
  LogOut,
  Play,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const CLOUDINARY_CLOUD = "doj0aeuvi";
const CLOUDINARY_PRESET = "vougestyleadvisor";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`;

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function YoAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  if (authLoading) {
    return (
      <div
        className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"
        data-ocid="yo_admin.loading_state"
      >
        <div className="w-6 h-6 border-2 border-[#c9a86a]/30 border-t-[#c9a86a] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AnimatePresence mode="wait">
        {user ? (
          <Dashboard key="dashboard" user={user} />
        ) : (
          <LoginScreen key="login" />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) return;
      setLoading(true);
      setError("");
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back");
      } catch {
        setError("Invalid email or password. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, password],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center px-4"
      data-ocid="yo_admin.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full border border-[#c9a86a]/30 flex items-center justify-center bg-[#c9a86a]/5">
            <Lock className="w-8 h-8 text-[#c9a86a]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#f5f1eb",
            }}
          >
            Gallery Admin
          </h1>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "#666", fontFamily: "'Poppins', sans-serif" }}
          >
            Private access only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            data-ocid="yo_admin.input"
            className="w-full bg-[#161616] border border-[#2a2a2a] rounded-none px-5 py-4 text-[#f5f1eb] placeholder-[#555] focus:outline-none focus:border-[#c9a86a]/60 transition-colors text-sm tracking-wide"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              data-ocid="yo_admin.input"
              className="w-full bg-[#161616] border border-[#2a2a2a] rounded-none px-5 py-4 pr-12 text-[#f5f1eb] placeholder-[#555] focus:outline-none focus:border-[#c9a86a]/60 transition-colors text-sm tracking-wide"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#c9a86a] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-rose-400 px-1"
                data-ocid="yo_admin.error_state"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || !email || !password}
            data-ocid="yo_admin.submit_button"
            className="w-full py-4 bg-[#c9a86a] text-[#0a0a0a] text-sm font-semibold tracking-widest uppercase transition-all hover:bg-[#d4b87a] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#1e1e1e]" />
          <span className="text-[#333] text-xs tracking-widest">✦</span>
          <div className="flex-1 h-px bg-[#1e1e1e]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ user }: { user: User }) {
  const [media, setMedia] = useState<(PrivateMediaItem & { fbKey: string })[]>(
    [],
  );
  const [mediaLoading, setMediaLoading] = useState(true);

  // Subscribe to live gallery updates
  useEffect(() => {
    const mediaRef = ref(db, "privateGallery/media");
    const unsub = onValue(mediaRef, (snapshot) => {
      if (!snapshot.exists()) {
        setMedia([]);
      } else {
        const data = snapshot.val() as Record<string, PrivateMediaItem>;
        const items = Object.entries(data)
          .map(([fbKey, item]) => ({ ...item, fbKey }))
          .sort((a, b) => b.createdAt - a.createdAt);
        setMedia(items);
      }
      setMediaLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    toast.success("Signed out");
  };

  const handleDelete = async (fbKey: string) => {
    try {
      await remove(ref(db, `privateGallery/media/${fbKey}`));
      toast.success("Item removed from gallery");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col"
      style={{ background: "#0e0c0b" }}
      data-ocid="yo_admin.panel"
    >
      {/* Header */}
      <header className="border-b border-[#1e1c1a] px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className="text-xl md:text-2xl font-bold tracking-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#f5f1eb",
              }}
            >
              Private Gallery Admin
            </h1>
            <p
              className="text-xs tracking-widest uppercase mt-0.5"
              style={{ color: "#555", fontFamily: "'Poppins', sans-serif" }}
            >
              {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            data-ocid="yo_admin.button"
            className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#888] hover:text-[#f5f1eb] transition-colors border border-[#2a2a2a] hover:border-[#c9a86a]/40 px-4 py-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList
            className="mb-8 bg-transparent border-b border-[#1e1c1a] rounded-none w-full justify-start gap-0 h-auto p-0"
            data-ocid="yo_admin.tab"
          >
            {(["upload", "gallery", "password"] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#c9a86a] data-[state=active]:text-[#c9a86a] text-[#666] hover:text-[#f5f1eb] px-6 py-3 text-xs tracking-widest uppercase bg-transparent data-[state=active]:bg-transparent transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {tab === "upload"
                  ? "Upload Media"
                  : tab === "gallery"
                    ? "Gallery"
                    : "Change Password"}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="upload">
            <UploadTab />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryTab
              media={media}
              loading={mediaLoading}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="password">
            <PasswordTab />
          </TabsContent>
        </Tabs>
      </main>
    </motion.div>
  );
}

// ─── Upload Tab ───────────────────────────────────────────────────────────────

function UploadTab() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(10);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      setProgress(30);
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      setProgress(70);

      if (!res.ok) throw new Error("Cloudinary upload failed");
      const data = await res.json();
      const url = data.secure_url as string;
      const type = file.type.startsWith("video") ? "video" : "image";

      // Save to Firebase
      const mediaRef = ref(db, "privateGallery/media");
      const newRef = push(mediaRef);
      const item: PrivateMediaItem = {
        id: newRef.key as string,
        type,
        url,
        title: file.name.replace(/\.[^.]+$/, ""),
        createdAt: Date.now(),
      };
      await set(newRef, item);
      setProgress(100);

      toast.success(
        `${type === "video" ? "Video" : "Image"} uploaded successfully`,
      );
      setFile(null);
      setPreview(null);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      toast.error("Upload failed. Please try again.");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const isVideo = file?.type.startsWith("video");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-xl"
      data-ocid="yo_admin.section"
    >
      <h2
        className="text-lg font-semibold mb-1"
        style={{ fontFamily: "'Playfair Display', serif", color: "#f5f1eb" }}
      >
        Upload Media
      </h2>
      <p
        className="text-xs text-[#666] mb-8 tracking-wide"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Add images or videos to the private gallery
      </p>

      {/* Drop zone */}
      <button
        type="button"
        data-ocid="yo_admin.dropzone"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-[#2a2a2a] hover:border-[#c9a86a]/40 transition-colors bg-[#111] text-center py-16 mb-6 group cursor-pointer"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
          data-ocid="yo_admin.upload_button"
        />
        <Upload className="w-8 h-8 text-[#333] group-hover:text-[#c9a86a]/60 transition-colors mx-auto mb-3" />
        <p
          className="text-sm text-[#555] group-hover:text-[#888] transition-colors"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Click to select an image or video
        </p>
        <p
          className="text-xs text-[#333] mt-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          JPG, PNG, MP4, MOV supported
        </p>
      </button>

      {/* Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="border border-[#2a2a2a] overflow-hidden bg-[#111]">
              {isVideo ? (
                <video
                  src={preview}
                  controls
                  playsInline
                  muted
                  className="w-full max-h-64 object-contain"
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain"
                />
              )}
            </div>
            <div className="mt-2 px-1 flex items-center justify-between">
              <p
                className="text-xs text-[#666] truncate"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {file?.name}
              </p>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="text-[#444] hover:text-rose-400 transition-colors text-xs ml-4 shrink-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Remove
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4"
            data-ocid="yo_admin.loading_state"
          >
            <Progress
              value={progress}
              className="h-0.5 bg-[#1e1e1e] [&>div]:bg-[#c9a86a]"
            />
            <p
              className="text-xs text-[#555] mt-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Uploading... {progress}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        data-ocid="yo_admin.primary_button"
        className="w-full py-4 bg-[#c9a86a] text-[#0a0a0a] text-sm font-semibold tracking-widest uppercase transition-all hover:bg-[#d4b87a] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" /> Upload to Gallery
          </>
        )}
      </button>
    </motion.div>
  );
}

// ─── Gallery Tab ──────────────────────────────────────────────────────────────

function GalleryTab({
  media,
  loading,
  onDelete,
}: {
  media: (PrivateMediaItem & { fbKey: string })[];
  loading: boolean;
  onDelete: (fbKey: string) => void;
}) {
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  const handleDelete = (fbKey: string) => {
    if (confirmKey === fbKey) {
      onDelete(fbKey);
      setConfirmKey(null);
    } else {
      setConfirmKey(fbKey);
      // Auto-reset after 3s
      setTimeout(
        () => setConfirmKey((prev) => (prev === fbKey ? null : prev)),
        3000,
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      data-ocid="yo_admin.section"
    >
      <h2
        className="text-lg font-semibold mb-1"
        style={{ fontFamily: "'Playfair Display', serif", color: "#f5f1eb" }}
      >
        Gallery
      </h2>
      <p
        className="text-xs text-[#666] mb-8 tracking-wide"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {loading
          ? "Loading..."
          : `${media.length} ${media.length === 1 ? "item" : "items"} in gallery`}
      </p>

      {loading ? (
        <div
          className="flex justify-center py-24"
          data-ocid="yo_admin.loading_state"
        >
          <div className="w-5 h-5 border-2 border-[#c9a86a]/30 border-t-[#c9a86a] rounded-full animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <div
          className="text-center py-24 border border-dashed border-[#1e1e1e]"
          data-ocid="yo_admin.empty_state"
        >
          <Image className="w-8 h-8 text-[#333] mx-auto mb-3" />
          <p
            className="text-sm text-[#555] tracking-widest uppercase"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            No media yet
          </p>
          <p
            className="text-xs text-[#333] mt-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Upload images or videos to see them here
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          data-ocid="yo_admin.list"
        >
          {media.map((item, i) => (
            <motion.div
              key={item.fbKey}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="group relative bg-[#151311] border border-[#1e1c1a] overflow-hidden"
              style={{ aspectRatio: "1" }}
              data-ocid={`yo_admin.item.${i + 1}`}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full relative bg-[#1a1714]">
                  <video
                    src={item.url}
                    muted
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                  >
                    <track kind="captions" />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#c9a86a]/80 flex items-center justify-center">
                      <Play
                        className="w-3 h-3 text-[#0a0a0a] ml-0.5"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                <p
                  className="text-xs text-[#f5f1eb] text-center truncate w-full px-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {item.title}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(item.fbKey)}
                  data-ocid={`yo_admin.delete_button.${i + 1}`}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 transition-colors ${
                    confirmKey === item.fbKey
                      ? "bg-rose-500 text-white"
                      : "bg-[#1e1e1e] text-[#c9a86a] hover:bg-rose-500/20 hover:text-rose-400 border border-[#333]"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Trash2 className="w-3 h-3" />
                  {confirmKey === item.fbKey ? "Confirm" : "Delete"}
                </button>
              </div>

              {/* Type badge */}
              <div className="absolute top-2 left-2">
                <span
                  className="text-[8px] tracking-widest uppercase px-1.5 py-0.5 bg-[#0a0a0a]/70 text-[#c9a86a] border border-[#c9a86a]/20"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {item.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Password Tab ─────────────────────────────────────────────────────────────

function PasswordTab() {
  const [current, setCurrent] = useState<string | null>(null);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    get(ref(db, "privateGallery/password")).then((snap) => {
      setCurrent(snap.exists() ? (snap.val() as string) : "test-2e4");
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw) return;
    if (newPw !== confirmPw) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPw.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    setSaving(true);
    try {
      await set(ref(db, "privateGallery/password"), newPw);
      setCurrent(newPw);
      setNewPw("");
      setConfirmPw("");
      toast.success("Gallery password updated successfully");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const mismatch = confirmPw.length > 0 && newPw !== confirmPw;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-md"
      data-ocid="yo_admin.section"
    >
      <h2
        className="text-lg font-semibold mb-1"
        style={{ fontFamily: "'Playfair Display', serif", color: "#f5f1eb" }}
      >
        Change Gallery Password
      </h2>
      <p
        className="text-xs text-[#666] mb-8 tracking-wide"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Update the password used to access the private gallery
      </p>

      {/* Current password display */}
      <div className="mb-8 p-5 bg-[#111] border border-[#1e1e1e]">
        <p
          className="text-xs text-[#555] tracking-widest uppercase mb-3"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Current Password
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono tracking-wider text-[#c9a86a] flex-1">
            {current === null
              ? "Loading..."
              : showCurrent
                ? current
                : "•".repeat(current.length)}
          </span>
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="text-[#444] hover:text-[#888] transition-colors"
          >
            {showCurrent ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* New password form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label
            htmlFor="yo-new-password"
            className="text-xs tracking-widest uppercase text-[#555] block mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="yo-new-password"
              type={showNew ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              data-ocid="yo_admin.input"
              className="w-full bg-[#161616] border border-[#2a2a2a] rounded-none px-5 py-4 pr-12 text-[#f5f1eb] placeholder-[#555] focus:outline-none focus:border-[#c9a86a]/60 transition-colors text-sm tracking-wide"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#c9a86a] transition-colors"
              tabIndex={-1}
            >
              {showNew ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="yo-confirm-password"
            className="text-xs tracking-widest uppercase text-[#555] block mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Confirm Password
          </label>
          <input
            id="yo-confirm-password"
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            data-ocid="yo_admin.input"
            className={`w-full bg-[#161616] border rounded-none px-5 py-4 text-[#f5f1eb] placeholder-[#555] focus:outline-none transition-colors text-sm tracking-wide ${
              mismatch
                ? "border-rose-500/60 focus:border-rose-500/80"
                : "border-[#2a2a2a] focus:border-[#c9a86a]/60"
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <AnimatePresence>
            {mismatch && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-rose-400 mt-1 px-1"
                data-ocid="yo_admin.error_state"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Passwords do not match
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={saving || !newPw || !confirmPw || mismatch}
          data-ocid="yo_admin.save_button"
          className="w-full py-4 bg-[#c9a86a] text-[#0a0a0a] text-sm font-semibold tracking-widest uppercase transition-all hover:bg-[#d4b87a] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </motion.div>
  );
}
