import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  type FirebaseBlogPost,
  type FirebaseBooking,
  type FirebaseContactMessage,
  type FirebasePortfolioItem,
  type FirebaseService,
  auth,
  deleteBlogPost,
  deleteContactMessage,
  deletePortfolioItem,
  deleteService,
  getAllBlogPosts,
  getAllBookings,
  getAllContactMessages,
  getAllPortfolioItems,
  getAllServices,
  markContactMessageRead,
  onAuthStateChanged,
  saveBlogPost,
  savePortfolioItem,
  saveService,
  signInWithEmailAndPassword,
  signOut,
  updateBlogPost,
  updateBookingStatus,
  updatePortfolioItem,
  updateService,
} from "@/lib/firebase";
import type { User } from "@/lib/firebase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Mail,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Auth Hook ──────────────────────────────────────────────────────────────

function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { user, loading };
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md shadow-sm p-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-[#111111] tracking-widest uppercase mb-1">
            vougestyleadvisor
          </h1>
          <p className="font-sans text-xs text-gray-400 tracking-[0.15em] uppercase">
            Admin Panel
          </p>
          <div className="w-8 h-px bg-[#C9A86A] mx-auto mt-4" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              data-ocid="admin.login_email_input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className="w-full font-sans text-sm border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              data-ocid="admin.login_password_input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full font-sans text-sm border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors"
            />
          </div>

          {error && (
            <p
              data-ocid="admin.login_error_state"
              className="font-sans text-xs text-red-500"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            data-ocid="admin.login_submit_button"
            disabled={isLoading}
            className="w-full font-sans text-sm tracking-[0.15em] uppercase bg-[#111111] text-white py-3.5 hover:bg-[#C9A86A] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

function ImageUploadField({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch {
      setUploadError(
        "Upload failed. Make sure your Cloudinary preset 'vougestyleadvisor' is set to Unsigned mode.",
      );
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected after an error
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or upload below"
          className="flex-1 font-sans text-xs border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A]"
        />
        <button
          type="button"
          data-ocid="admin.image_upload_button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase border border-[#111111] text-[#111111] px-4 py-2.5 hover:bg-[#111111] hover:text-white transition-all disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Upload size={12} />
          )}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {value && (
        <img
          src={value}
          alt="preview"
          className="mt-2 w-20 h-20 object-cover border border-gray-100"
        />
      )}
      {uploadError && (
        <p className="text-xs text-red-500 mt-1">{uploadError}</p>
      )}
    </div>
  );
}

// ─── Blog Tab ─────────────────────────────────────────────────────────────────

const BLOG_CATEGORIES = [
  "Casual Fashion",
  "Party Fashion",
  "Budget Fashion",
  "Seasonal Fashion",
  "Styling Tips",
];

function BlogTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<FirebaseBlogPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FirebaseBlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    author: "Shagun Goyal",
    category: "Casual Fashion",
    imageUrl: "",
    tags: [],
    isPublished: false,
  });

  const { data: posts, isLoading } = useQuery<FirebaseBlogPost[]>({
    queryKey: ["allBlogPosts"],
    queryFn: getAllBlogPosts,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const post: FirebaseBlogPost = {
        id: editPost?.id ?? crypto.randomUUID(),
        title: formData.title ?? "",
        excerpt: formData.excerpt ?? "",
        content: formData.content ?? "",
        author: formData.author ?? "Shagun Goyal",
        category: formData.category ?? "Casual Fashion",
        imageUrl: formData.imageUrl ?? "",
        tags: formData.tags ?? [],
        isPublished: formData.isPublished ?? false,
        publishDate: editPost?.publishDate ?? Date.now(),
      };
      await saveBlogPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["publishedBlogPosts"] });
      setShowForm(false);
      setEditPost(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["publishedBlogPosts"] });
      setConfirmDelete(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      await updateBlogPost(id, { isPublished: val });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["publishedBlogPosts"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "Shagun Goyal",
      category: "Casual Fashion",
      imageUrl: "",
      tags: [],
      isPublished: false,
    });
  };

  const openEdit = (post: FirebaseBlogPost) => {
    setEditPost(post);
    setFormData(post);
    setShowForm(true);
  };

  const openNew = () => {
    setEditPost(null);
    resetForm();
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-[#111111]">Blog Posts</h2>
        <button
          type="button"
          data-ocid="admin.new_post_button"
          onClick={openNew}
          className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase bg-[#111111] text-white px-5 py-2.5 hover:bg-[#C9A86A] transition-all"
        >
          <Plus size={13} /> New Post
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#F5F1EB] p-6 mb-6 space-y-4">
          <h3 className="font-serif text-lg text-[#111111]">
            {editPost ? "Edit Post" : "New Post"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="blog-title"
                className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
              >
                Title *
              </label>
              <input
                id="blog-title"
                type="text"
                value={formData.title ?? ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white"
                placeholder="Post title"
              />
            </div>
            <div>
              <label
                htmlFor="blog-category"
                className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
              >
                Category
              </label>
              <select
                id="blog-category"
                value={formData.category ?? "Casual Fashion"}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, category: e.target.value }))
                }
                className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white"
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="blog-author"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Author
            </label>
            <input
              id="blog-author"
              type="text"
              value={formData.author ?? "Shagun Goyal"}
              onChange={(e) =>
                setFormData((p) => ({ ...p, author: e.target.value }))
              }
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="blog-excerpt"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Excerpt
            </label>
            <textarea
              id="blog-excerpt"
              rows={2}
              value={formData.excerpt ?? ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, excerpt: e.target.value }))
              }
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white resize-none"
              placeholder="Short description for blog card"
            />
          </div>

          <div>
            <label
              htmlFor="blog-content"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Content
            </label>
            <textarea
              id="blog-content"
              rows={8}
              value={formData.content ?? ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, content: e.target.value }))
              }
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white resize-none"
              data-ocid="admin.post_editor"
              placeholder="Write your post content here. Use ## for headings."
            />
          </div>

          <ImageUploadField
            label="Cover Image"
            value={formData.imageUrl ?? ""}
            onChange={(url) => setFormData((p) => ({ ...p, imageUrl: url }))}
          />

          <div>
            <label
              htmlFor="blog-tags"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Tags (comma-separated)
            </label>
            <input
              id="blog-tags"
              type="text"
              value={(formData.tags ?? []).join(", ")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                }))
              }
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white"
              placeholder="fashion, styling, tips"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="font-sans text-xs tracking-wide uppercase text-gray-600">
              Published
            </span>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({ ...p, isPublished: !p.isPublished }))
              }
              className="text-[#C9A86A]"
            >
              {formData.isPublished ? (
                <ToggleRight size={28} />
              ) : (
                <ToggleLeft size={28} className="text-gray-300" />
              )}
            </button>
          </div>

          {saveMutation.isError && (
            <p className="font-sans text-xs text-red-500">
              Failed to save. Please try again.
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              data-ocid="admin.post_save_button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase bg-[#111111] text-white px-6 py-2.5 hover:bg-[#C9A86A] transition-all disabled:opacity-50"
            >
              {saveMutation.isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <CheckCircle2 size={12} />
              )}
              {saveMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditPost(null);
              }}
              className="font-sans text-xs tracking-wide uppercase border border-gray-300 text-gray-500 px-6 py-2.5 hover:border-[#111111] hover:text-[#111111] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Posts list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className="h-14 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : !posts || posts.length === 0 ? (
        <p className="font-sans text-sm text-gray-400 text-center py-10">
          No blog posts yet. Create your first post!
        </p>
      ) : (
        <div className="space-y-2">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              data-ocid={`admin.post_row.${idx + 1}`}
              className="flex items-center gap-4 bg-white border border-gray-100 px-4 py-3 hover:border-gray-200 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-[#111111] truncate">
                  {post.title}
                </p>
                <p className="font-sans text-[10px] text-gray-400 tracking-wide">
                  {post.category}
                </p>
              </div>
              <span
                className={`font-sans text-[9px] tracking-[0.15em] uppercase px-2 py-1 ${
                  post.isPublished
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {post.isPublished ? "Published" : "Draft"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  data-ocid={`admin.post_edit_button.${idx + 1}`}
                  onClick={() => openEdit(post)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C9A86A] transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toggleMutation.mutate({
                      id: post.id,
                      val: !post.isPublished,
                    })
                  }
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C9A86A] transition-colors"
                  title={post.isPublished ? "Unpublish" : "Publish"}
                >
                  {post.isPublished ? (
                    <ToggleRight size={16} />
                  ) : (
                    <ToggleLeft size={16} />
                  )}
                </button>
                {confirmDelete === post.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      data-ocid={`admin.post_delete_button.${idx + 1}`}
                      onClick={() => deleteMutation.mutate(post.id)}
                      className="font-sans text-[9px] tracking-wide uppercase bg-red-500 text-white px-2 py-1 hover:bg-red-600 transition-all"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="font-sans text-[9px] tracking-wide uppercase border border-gray-200 text-gray-500 px-2 py-1 hover:border-gray-400 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid={`admin.post_delete_button.${idx + 1}`}
                    onClick={() => setConfirmDelete(post.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Portfolio Tab ────────────────────────────────────────────────────────────

const PORTFOLIO_CATEGORIES = [
  "Casual Styling",
  "Event Styling",
  "Minimalist Looks",
  "Seasonal Fashion",
];

function PortfolioTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<FirebasePortfolioItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FirebasePortfolioItem>>({
    title: "",
    description: "",
    stylingExplanation: "",
    fashionTips: "",
    category: "Casual Styling",
    imageUrl: "",
    isPublished: false,
  });

  const { data: items, isLoading } = useQuery<FirebasePortfolioItem[]>({
    queryKey: ["allPortfolioItems"],
    queryFn: getAllPortfolioItems,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const item: FirebasePortfolioItem = {
        id: editItem?.id ?? crypto.randomUUID(),
        title: formData.title ?? "",
        description: formData.description ?? "",
        stylingExplanation: formData.stylingExplanation ?? "",
        fashionTips: formData.fashionTips ?? "",
        category: formData.category ?? "Casual Styling",
        imageUrl: formData.imageUrl ?? "",
        isPublished: formData.isPublished ?? false,
      };
      await savePortfolioItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPortfolioItems"] });
      queryClient.invalidateQueries({ queryKey: ["publishedPortfolioItems"] });
      setShowForm(false);
      setEditItem(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deletePortfolioItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPortfolioItems"] });
      queryClient.invalidateQueries({ queryKey: ["publishedPortfolioItems"] });
      setConfirmDelete(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      await updatePortfolioItem(id, { isPublished: val });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPortfolioItems"] });
      queryClient.invalidateQueries({ queryKey: ["publishedPortfolioItems"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      stylingExplanation: "",
      fashionTips: "",
      category: "Casual Styling",
      imageUrl: "",
      isPublished: false,
    });
  };

  const openEdit = (item: FirebasePortfolioItem) => {
    setEditItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const openNew = () => {
    setEditItem(null);
    resetForm();
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-[#111111]">Portfolio Items</h2>
        <button
          type="button"
          data-ocid="admin.new_portfolio_button"
          onClick={openNew}
          className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase bg-[#111111] text-white px-5 py-2.5 hover:bg-[#C9A86A] transition-all"
        >
          <Plus size={13} /> New Item
        </button>
      </div>

      {showForm && (
        <div className="bg-[#F5F1EB] p-6 mb-6 space-y-4">
          <h3 className="font-serif text-lg text-[#111111]">
            {editItem ? "Edit Item" : "New Portfolio Item"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="port-title"
                className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
              >
                Title *
              </label>
              <input
                id="port-title"
                type="text"
                value={formData.title ?? ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white"
                placeholder="Portfolio item title"
              />
            </div>
            <div>
              <label
                htmlFor="port-category"
                className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
              >
                Category
              </label>
              <select
                id="port-category"
                value={formData.category ?? "Casual Styling"}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, category: e.target.value }))
                }
                className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white"
              >
                {PORTFOLIO_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="port-desc"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Description
            </label>
            <textarea
              id="port-desc"
              rows={2}
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="port-styling"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Styling Explanation
            </label>
            <textarea
              id="port-styling"
              rows={3}
              value={formData.stylingExplanation ?? ""}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  stylingExplanation: e.target.value,
                }))
              }
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="port-tips"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Fashion Tips
            </label>
            <textarea
              id="port-tips"
              rows={3}
              value={formData.fashionTips ?? ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, fashionTips: e.target.value }))
              }
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white resize-none"
            />
          </div>

          <ImageUploadField
            label="Portfolio Image"
            value={formData.imageUrl ?? ""}
            onChange={(url) => setFormData((p) => ({ ...p, imageUrl: url }))}
          />

          <div className="flex items-center gap-3">
            <span className="font-sans text-xs tracking-wide uppercase text-gray-600">
              Published
            </span>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({ ...p, isPublished: !p.isPublished }))
              }
              className="text-[#C9A86A]"
            >
              {formData.isPublished ? (
                <ToggleRight size={28} />
              ) : (
                <ToggleLeft size={28} className="text-gray-300" />
              )}
            </button>
          </div>

          {saveMutation.isError && (
            <p className="font-sans text-xs text-red-500">
              Failed to save. Please try again.
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              data-ocid="admin.portfolio_save_button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase bg-[#111111] text-white px-6 py-2.5 hover:bg-[#C9A86A] transition-all disabled:opacity-50"
            >
              {saveMutation.isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <CheckCircle2 size={12} />
              )}
              {saveMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditItem(null);
              }}
              className="font-sans text-xs tracking-wide uppercase border border-gray-300 text-gray-500 px-6 py-2.5 hover:border-[#111111] hover:text-[#111111] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className="h-14 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <p className="font-sans text-sm text-gray-400 text-center py-10">
          No portfolio items yet.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              data-ocid={`admin.portfolio_row.${idx + 1}`}
              className="flex items-center gap-4 bg-white border border-gray-100 px-4 py-3 hover:border-gray-200 transition-all"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-10 h-10 object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-[#111111] truncate">
                  {item.title}
                </p>
                <p className="font-sans text-[10px] text-gray-400 tracking-wide">
                  {item.category}
                </p>
              </div>
              <span
                className={`font-sans text-[9px] tracking-[0.15em] uppercase px-2 py-1 ${
                  item.isPublished
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {item.isPublished ? "Published" : "Draft"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  data-ocid={`admin.portfolio_edit_button.${idx + 1}`}
                  onClick={() => openEdit(item)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C9A86A] transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toggleMutation.mutate({
                      id: item.id,
                      val: !item.isPublished,
                    })
                  }
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C9A86A] transition-colors"
                >
                  {item.isPublished ? (
                    <ToggleRight size={16} />
                  ) : (
                    <ToggleLeft size={16} />
                  )}
                </button>
                {confirmDelete === item.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(item.id)}
                      className="font-sans text-[9px] tracking-wide uppercase bg-red-500 text-white px-2 py-1"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="font-sans text-[9px] tracking-wide uppercase border border-gray-200 text-gray-500 px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid={`admin.portfolio_delete_button.${idx + 1}`}
                    onClick={() => setConfirmDelete(item.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Services Tab ─────────────────────────────────────────────────────────────

function ServicesTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState<FirebaseService | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FirebaseService>>({
    title: "",
    description: "",
    price: "",
    isActive: true,
  });

  const { data: services, isLoading } = useQuery<FirebaseService[]>({
    queryKey: ["allServices"],
    queryFn: getAllServices,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const service: FirebaseService = {
        id: editService?.id ?? crypto.randomUUID(),
        title: formData.title ?? "",
        description: formData.description ?? "",
        price: formData.price ?? "",
        isActive: formData.isActive ?? true,
      };
      await saveService(service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allServices"] });
      queryClient.invalidateQueries({ queryKey: ["activeServices"] });
      setShowForm(false);
      setEditService(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allServices"] });
      queryClient.invalidateQueries({ queryKey: ["activeServices"] });
      setConfirmDelete(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      await updateService(id, { isActive: val });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allServices"] });
      queryClient.invalidateQueries({ queryKey: ["activeServices"] });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "", isActive: true });
  };

  const openEdit = (service: FirebaseService) => {
    setEditService(service);
    setFormData(service);
    setShowForm(true);
  };

  const openNew = () => {
    setEditService(null);
    resetForm();
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-[#111111]">Services</h2>
        <button
          type="button"
          data-ocid="admin.new_service_button"
          onClick={openNew}
          className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase bg-[#111111] text-white px-5 py-2.5 hover:bg-[#C9A86A] transition-all"
        >
          <Plus size={13} /> New Service
        </button>
      </div>

      {showForm && (
        <div className="bg-[#F5F1EB] p-6 mb-6 space-y-4">
          <h3 className="font-serif text-lg text-[#111111]">
            {editService ? "Edit Service" : "New Service"}
          </h3>
          <div>
            <label
              htmlFor="svc-form-title"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Service Title *
            </label>
            <input
              id="svc-form-title"
              type="text"
              value={formData.title ?? ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="svc-form-desc"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Description
            </label>
            <textarea
              id="svc-form-desc"
              rows={3}
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white resize-none"
            />
          </div>
          <div>
            <label
              htmlFor="svc-form-price"
              className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
            >
              Price
            </label>
            <input
              id="svc-form-price"
              type="text"
              value={formData.price ?? ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="₹199 per consultation"
              className="w-full font-sans text-sm border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C9A86A] bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs tracking-wide uppercase text-gray-600">
              Active
            </span>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({ ...p, isActive: !p.isActive }))
              }
              className="text-[#C9A86A]"
            >
              {formData.isActive ? (
                <ToggleRight size={28} />
              ) : (
                <ToggleLeft size={28} className="text-gray-300" />
              )}
            </button>
          </div>
          {saveMutation.isError && (
            <p className="font-sans text-xs text-red-500">Failed to save.</p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              data-ocid="admin.service_save_button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase bg-[#111111] text-white px-6 py-2.5 hover:bg-[#C9A86A] transition-all disabled:opacity-50"
            >
              {saveMutation.isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <CheckCircle2 size={12} />
              )}
              {saveMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditService(null);
              }}
              className="font-sans text-xs tracking-wide uppercase border border-gray-300 text-gray-500 px-6 py-2.5 hover:border-[#111111] hover:text-[#111111] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className="h-14 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : !services || services.length === 0 ? (
        <p className="font-sans text-sm text-gray-400 text-center py-10">
          No services yet.
        </p>
      ) : (
        <div className="space-y-2">
          {services.map((service, idx) => (
            <div
              key={service.id}
              data-ocid={`admin.service_row.${idx + 1}`}
              className="flex items-center gap-4 bg-white border border-gray-100 px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-[#111111] truncate">
                  {service.title}
                </p>
                <p className="font-sans text-[10px] text-[#C9A86A]">
                  {service.price}
                </p>
              </div>
              <span
                className={`font-sans text-[9px] tracking-[0.15em] uppercase px-2 py-1 ${
                  service.isActive
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {service.isActive ? "Active" : "Inactive"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  data-ocid={`admin.service_edit_button.${idx + 1}`}
                  onClick={() => openEdit(service)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C9A86A] transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toggleMutation.mutate({
                      id: service.id,
                      val: !service.isActive,
                    })
                  }
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C9A86A] transition-colors"
                >
                  {service.isActive ? (
                    <ToggleRight size={16} />
                  ) : (
                    <ToggleLeft size={16} />
                  )}
                </button>
                {confirmDelete === service.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(service.id)}
                      className="font-sans text-[9px] tracking-wide uppercase bg-red-500 text-white px-2 py-1"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="font-sans text-[9px] tracking-wide uppercase border border-gray-200 text-gray-500 px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid={`admin.service_delete_button.${idx + 1}`}
                    onClick={() => setConfirmDelete(service.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bookings Tab ─────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

function BookingsTab() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery<FirebaseBooking[]>({
    queryKey: ["allBookings"],
    queryFn: getAllBookings,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });

  function formatBookingDate(submittedAt: number): string {
    try {
      return new Date(submittedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-[#111111] mb-6">
        Booking Requests
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className="h-14 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <p className="font-sans text-sm text-gray-400 text-center py-10">
          No booking requests yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[#F5F1EB]">
                {[
                  "Name",
                  "Email",
                  "WhatsApp",
                  "Service",
                  "Message",
                  "Date",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-sans text-[10px] tracking-[0.12em] uppercase text-gray-500 text-left px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr
                  key={booking.id}
                  data-ocid={`admin.booking_row.${idx + 1}`}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-sans text-sm text-[#111111] whitespace-nowrap">
                    {booking.fullName}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-500">
                    {booking.email}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-500">
                    {booking.whatsapp || "—"}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-500 max-w-[120px] truncate">
                    {booking.serviceId}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-500 max-w-[160px] truncate">
                    {booking.message || "—"}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-500 whitespace-nowrap">
                    {formatBookingDate(booking.submittedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({
                          id: booking.id,
                          status: e.target.value,
                        })
                      }
                      className={`font-sans text-[10px] tracking-wide uppercase border px-2 py-1.5 focus:outline-none focus:border-[#C9A86A] bg-white ${
                        booking.status === "pending"
                          ? "border-yellow-200 text-yellow-600"
                          : booking.status === "confirmed"
                            ? "border-blue-200 text-blue-600"
                            : booking.status === "completed"
                              ? "border-green-200 text-green-600"
                              : "border-red-200 text-red-500"
                      }`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function MessagesTab() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: messages, isLoading } = useQuery<FirebaseContactMessage[]>({
    queryKey: ["allContactMessages"],
    queryFn: getAllContactMessages,
  });

  const markReadMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      await markContactMessageRead(id, isRead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContactMessages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteContactMessage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContactMessages"] });
      setConfirmDelete(null);
    },
  });

  function formatDate(ts: number): string {
    try {
      return new Date(ts).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  }

  const unreadCount = messages?.filter((m) => !m.isRead).length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-xl text-[#111111]">
            Contact Messages
          </h2>
          {unreadCount > 0 && (
            <span className="font-sans text-[10px] tracking-wide uppercase bg-[#E8B4B8] text-[#111111] px-2 py-0.5">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className="h-14 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : !messages || messages.length === 0 ? (
        <div
          data-ocid="admin.messages_empty_state"
          className="flex flex-col items-center justify-center text-center py-16"
        >
          <Mail size={32} className="text-gray-300 mb-3" />
          <p className="font-sans text-sm text-gray-400">
            No contact messages yet.
          </p>
          <p className="font-sans text-xs text-gray-300 mt-1">
            Messages from the Contact page will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              data-ocid={`admin.message_row.${idx + 1}`}
              className={`border transition-all ${
                msg.isRead
                  ? "border-gray-100 bg-white"
                  : "border-[#E8B4B8]/40 bg-[#FDF8F8]"
              }`}
            >
              {/* Row header */}
              <div className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#E8B4B8] flex-shrink-0" />
                    )}
                    <p className="font-sans text-sm text-[#111111] truncate font-medium">
                      {msg.name}
                    </p>
                    <span className="font-sans text-xs text-gray-400 truncate hidden sm:block">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>
                  <p className="font-sans text-xs text-gray-400 mt-0.5 truncate pl-4">
                    {msg.message}
                  </p>
                </div>
                <span className="font-sans text-[10px] text-gray-400 whitespace-nowrap hidden md:block">
                  {formatDate(msg.submittedAt)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    data-ocid={`admin.message_expand_button.${idx + 1}`}
                    onClick={() =>
                      setExpandedId(expandedId === msg.id ? null : msg.id)
                    }
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C9A86A] transition-colors"
                    title="View message"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    type="button"
                    data-ocid={`admin.message_read_button.${idx + 1}`}
                    onClick={() =>
                      markReadMutation.mutate({
                        id: msg.id,
                        isRead: !msg.isRead,
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C9A86A] transition-colors"
                    title={msg.isRead ? "Mark as unread" : "Mark as read"}
                  >
                    {msg.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {confirmDelete === msg.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        data-ocid={`admin.message_confirm_delete_button.${idx + 1}`}
                        onClick={() => deleteMutation.mutate(msg.id)}
                        className="font-sans text-[9px] tracking-wide uppercase bg-red-500 text-white px-2 py-1"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="font-sans text-[9px] tracking-wide uppercase border border-gray-200 text-gray-500 px-2 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      data-ocid={`admin.message_delete_button.${idx + 1}`}
                      onClick={() => setConfirmDelete(msg.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded view */}
              {expandedId === msg.id && (
                <div className="border-t border-gray-100 px-4 py-4 bg-white space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-gray-400 block mb-0.5">
                        From
                      </span>
                      <span className="font-sans text-sm text-[#111111]">
                        {msg.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-gray-400 block mb-0.5">
                        Email
                      </span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="font-sans text-sm text-[#C9A86A] hover:underline"
                      >
                        {msg.email}
                      </a>
                    </div>
                    <div>
                      <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-gray-400 block mb-0.5">
                        Date
                      </span>
                      <span className="font-sans text-sm text-[#111111]">
                        {formatDate(msg.submittedAt)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-gray-400 block mb-1">
                      Message
                    </span>
                    <p className="font-sans text-sm text-[#111111] leading-relaxed whitespace-pre-wrap bg-[#F5F1EB] px-4 py-3">
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a
                      href={`mailto:${msg.email}?subject=Re: Your message to vougestyleadvisor`}
                      className="font-sans text-xs tracking-wide uppercase bg-[#111111] text-white px-5 py-2 hover:bg-[#C9A86A] transition-all flex items-center gap-2"
                    >
                      <Mail size={12} /> Reply via Email
                    </a>
                    {!msg.isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          markReadMutation.mutate({ id: msg.id, isRead: true })
                        }
                        className="font-sans text-xs tracking-wide uppercase border border-gray-200 text-gray-500 px-5 py-2 hover:border-[#111111] hover:text-[#111111] transition-all"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type AdminTab = "blog" | "portfolio" | "services" | "bookings" | "messages";

function AdminDashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("messages");

  const handleSignOut = () => {
    signOut(auth);
  };

  const TABS: { key: AdminTab; label: string; ocid: string }[] = [
    { key: "messages", label: "Messages", ocid: "admin.messages_tab" },
    { key: "bookings", label: "Bookings", ocid: "admin.bookings_tab" },
    { key: "blog", label: "Blog", ocid: "admin.blog_tab" },
    { key: "portfolio", label: "Portfolio", ocid: "admin.portfolio_tab" },
    { key: "services", label: "Services", ocid: "admin.services_tab" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-lg text-[#111111] tracking-wide">
            Admin Dashboard
          </h1>
          <p className="font-sans text-[10px] text-gray-400 tracking-wide">
            {user.email}
          </p>
        </div>
        <button
          type="button"
          data-ocid="admin.signout_button"
          onClick={handleSignOut}
          className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase border border-gray-200 text-gray-500 px-5 py-2.5 hover:border-[#111111] hover:text-[#111111] transition-all"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              data-ocid={tab.ocid}
              onClick={() => setActiveTab(tab.key)}
              className={`font-sans text-xs tracking-[0.12em] uppercase px-5 py-3.5 transition-all duration-200 border-b-2 ${
                activeTab === tab.key
                  ? "border-[#C9A86A] text-[#111111]"
                  : "border-transparent text-gray-400 hover:text-[#111111]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white p-6 shadow-sm">
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "blog" && <BlogTab />}
          {activeTab === "portfolio" && <PortfolioTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "bookings" && <BookingsTab />}
        </div>
      </main>
    </div>
  );
}

// ─── Root Export ─────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user, loading } = useFirebaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#C9A86A]" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <AdminDashboard user={user} />;
}
