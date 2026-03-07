import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDqTJ8h1xYtHjRJrUQ4z8bI-l5zhCeOcKY",
  authDomain: "vouge-styleadvisor.firebaseapp.com",
  databaseURL:
    "https://vouge-styleadvisor-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vouge-styleadvisor",
  storageBucket: "vouge-styleadvisor.firebasestorage.app",
  messagingSenderId: "1020953271632",
  appId: "1:1020953271632:web:0dafd4bbaf8eb35a8d2055",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export { onAuthStateChanged, signInWithEmailAndPassword, signOut };
export type { User };

// ─── Bookings ────────────────────────────────────────────────────────────────

export interface FirebaseBooking {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  serviceId: string;
  message: string;
  status: string;
  submittedAt: number;
}

export async function saveBooking(
  booking: Omit<FirebaseBooking, "id">,
): Promise<string> {
  const bookingsRef = ref(db, "bookings");
  const newRef = push(bookingsRef);
  const id = newRef.key as string;
  await set(newRef, { ...booking, id });
  return id;
}

export async function getAllBookings(): Promise<FirebaseBooking[]> {
  const bookingsRef = ref(db, "bookings");
  const snapshot = await get(bookingsRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val() as Record<string, FirebaseBooking>;
  return Object.values(data).sort((a, b) => b.submittedAt - a.submittedAt);
}

export async function updateBookingStatus(
  id: string,
  status: string,
): Promise<void> {
  const bookingRef = ref(db, `bookings/${id}`);
  await update(bookingRef, { status });
}

// ─── Blog Posts ──────────────────────────────────────────────────────────────

export interface FirebaseBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
  tags: string[];
  isPublished: boolean;
  publishDate: number;
}

export async function saveBlogPost(post: FirebaseBlogPost): Promise<void> {
  const postRef = ref(db, `blogPosts/${post.id}`);
  await set(postRef, post);
}

export async function getAllBlogPosts(): Promise<FirebaseBlogPost[]> {
  const postsRef = ref(db, "blogPosts");
  const snapshot = await get(postsRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val() as Record<string, FirebaseBlogPost>;
  return Object.values(data).sort((a, b) => b.publishDate - a.publishDate);
}

export async function getPublishedBlogPosts(): Promise<FirebaseBlogPost[]> {
  const all = await getAllBlogPosts();
  return all.filter((p) => p.isPublished);
}

export async function getBlogPostById(
  id: string,
): Promise<FirebaseBlogPost | null> {
  const postRef = ref(db, `blogPosts/${id}`);
  const snapshot = await get(postRef);
  if (!snapshot.exists()) return null;
  return snapshot.val() as FirebaseBlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const postRef = ref(db, `blogPosts/${id}`);
  await remove(postRef);
}

export async function updateBlogPost(
  id: string,
  updates: Partial<FirebaseBlogPost>,
): Promise<void> {
  const postRef = ref(db, `blogPosts/${id}`);
  await update(postRef, updates);
}

// ─── Portfolio Items ──────────────────────────────────────────────────────────

export interface FirebasePortfolioItem {
  id: string;
  title: string;
  description: string;
  stylingExplanation: string;
  fashionTips: string;
  category: string;
  imageUrl: string;
  isPublished: boolean;
}

export async function savePortfolioItem(
  item: FirebasePortfolioItem,
): Promise<void> {
  const itemRef = ref(db, `portfolioItems/${item.id}`);
  await set(itemRef, item);
}

export async function getAllPortfolioItems(): Promise<FirebasePortfolioItem[]> {
  const itemsRef = ref(db, "portfolioItems");
  const snapshot = await get(itemsRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val() as Record<string, FirebasePortfolioItem>;
  return Object.values(data);
}

export async function getPublishedPortfolioItems(): Promise<
  FirebasePortfolioItem[]
> {
  const all = await getAllPortfolioItems();
  return all.filter((i) => i.isPublished);
}

export async function getPortfolioItemById(
  id: string,
): Promise<FirebasePortfolioItem | null> {
  const itemRef = ref(db, `portfolioItems/${id}`);
  const snapshot = await get(itemRef);
  if (!snapshot.exists()) return null;
  return snapshot.val() as FirebasePortfolioItem;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const itemRef = ref(db, `portfolioItems/${id}`);
  await remove(itemRef);
}

export async function updatePortfolioItem(
  id: string,
  updates: Partial<FirebasePortfolioItem>,
): Promise<void> {
  const itemRef = ref(db, `portfolioItems/${id}`);
  await update(itemRef, updates);
}

// ─── Services ────────────────────────────────────────────────────────────────

export interface FirebaseService {
  id: string;
  title: string;
  description: string;
  price: string;
  isActive: boolean;
}

export async function saveService(service: FirebaseService): Promise<void> {
  const serviceRef = ref(db, `services/${service.id}`);
  await set(serviceRef, service);
}

export async function getAllServices(): Promise<FirebaseService[]> {
  const servicesRef = ref(db, "services");
  const snapshot = await get(servicesRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val() as Record<string, FirebaseService>;
  return Object.values(data);
}

export async function getActiveServices(): Promise<FirebaseService[]> {
  const all = await getAllServices();
  return all.filter((s) => s.isActive);
}

export async function deleteService(id: string): Promise<void> {
  const serviceRef = ref(db, `services/${id}`);
  await remove(serviceRef);
}

export async function updateService(
  id: string,
  updates: Partial<FirebaseService>,
): Promise<void> {
  const serviceRef = ref(db, `services/${id}`);
  await update(serviceRef, updates);
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function saveNewsletterSubscriber(
  name: string,
  email: string,
): Promise<void> {
  const subscribersRef = ref(db, "newsletterSubscribers");
  const newRef = push(subscribersRef);
  await set(newRef, {
    id: newRef.key,
    name,
    email,
    subscribedAt: Date.now(),
  });
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export interface FirebaseContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: number;
  isRead: boolean;
}

export async function saveContactMessage(
  data: Omit<FirebaseContactMessage, "id">,
): Promise<string> {
  const messagesRef = ref(db, "contactMessages");
  const newRef = push(messagesRef);
  const id = newRef.key as string;
  await set(newRef, { ...data, id });
  return id;
}

export async function getAllContactMessages(): Promise<
  FirebaseContactMessage[]
> {
  const messagesRef = ref(db, "contactMessages");
  const snapshot = await get(messagesRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val() as Record<string, FirebaseContactMessage>;
  return Object.values(data).sort((a, b) => b.submittedAt - a.submittedAt);
}

export async function markContactMessageRead(
  id: string,
  isRead: boolean,
): Promise<void> {
  const msgRef = ref(db, `contactMessages/${id}`);
  await update(msgRef, { isRead });
}

export async function deleteContactMessage(id: string): Promise<void> {
  const msgRef = ref(db, `contactMessages/${id}`);
  await remove(msgRef);
}

// re-export child for convenience
export { child };
