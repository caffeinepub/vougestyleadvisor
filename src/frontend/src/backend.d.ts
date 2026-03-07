import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    isPublished: boolean;
    publishDate: Time;
    tags: Array<string>;
    author: string;
    imageUrl: string;
    excerpt: string;
    category: string;
}
export type Time = bigint;
export interface PortfolioItem {
    id: string;
    stylingExplanation: string;
    title: string;
    isPublished: boolean;
    fashionTips: string;
    description: string;
    imageUrl: string;
    category: string;
}
export interface Service {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
    price: string;
}
export interface BookingRequest {
    id: string;
    status: string;
    whatsapp: string;
    fullName: string;
    submittedAt: Time;
    email: string;
    message: string;
    serviceId: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(post: BlogPost): Promise<void>;
    createPortfolioItem(item: PortfolioItem): Promise<void>;
    createService(service: Service): Promise<void>;
    deleteBlogPost(id: string): Promise<void>;
    deletePortfolioItem(id: string): Promise<void>;
    deleteService(id: string): Promise<void>;
    getActiveServices(): Promise<Array<Service>>;
    getAllBookingRequests(): Promise<Array<BookingRequest>>;
    getBlogPostById(id: string): Promise<BlogPost | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPortfolioItemById(id: string): Promise<PortfolioItem | null>;
    getPublishedBlogPosts(): Promise<Array<BlogPost>>;
    getPublishedPortfolioItems(): Promise<Array<PortfolioItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBookingRequest(request: BookingRequest): Promise<void>;
    subscribeToNewsletter(id: string, name: string, email: string): Promise<void>;
    toggleBlogPostPublish(id: string, isPublished: boolean): Promise<void>;
    togglePortfolioItemPublish(id: string, isPublished: boolean): Promise<void>;
    toggleServiceActive(id: string, isActive: boolean): Promise<void>;
    updateBlogPost(post: BlogPost): Promise<void>;
    updateBookingRequestStatus(id: string, status: string): Promise<void>;
    updatePortfolioItem(item: PortfolioItem): Promise<void>;
    updateService(service: Service): Promise<void>;
}
