import List "mo:core/List";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module FashionAdvisor {
    public type BlogPost = {
      id : Text;
      title : Text;
      excerpt : Text;
      content : Text;
      category : Text;
      imageUrl : Text;
      author : Text;
      publishDate : Time.Time;
      isPublished : Bool;
      tags : [Text];
    };

    public type PortfolioItem = {
      id : Text;
      title : Text;
      description : Text;
      imageUrl : Text;
      category : Text;
      stylingExplanation : Text;
      fashionTips : Text;
      isPublished : Bool;
    };

    public type Service = {
      id : Text;
      title : Text;
      description : Text;
      price : Text;
      isActive : Bool;
    };

    public type BookingRequest = {
      id : Text;
      fullName : Text;
      email : Text;
      whatsapp : Text;
      serviceId : Text;
      message : Text;
      submittedAt : Time.Time;
      status : Text; // pending, reviewed, completed
    };

    module BookingRequest {
      public func compare(a : FashionAdvisor.BookingRequest, b : FashionAdvisor.BookingRequest) : Order.Order {
        Text.compare(a.id, b.id);
      };
    };
  };

  public type NewsletterSubscription = {
    id : Text;
    name : Text;
    email : Text;
    subscribedAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  include MixinStorage();

  // State (persistent)
  let blogPosts = Map.empty<Text, FashionAdvisor.BlogPost>();
  let portfolioItems = Map.empty<Text, FashionAdvisor.PortfolioItem>();
  let services = Map.empty<Text, FashionAdvisor.Service>();
  let newsletterSubscriptions = Map.empty<Text, NewsletterSubscription>();
  let bookingRequests = Map.empty<Text, FashionAdvisor.BookingRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization state (persistent)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public queries - no authorization needed
  public query func getPublishedBlogPosts() : async [FashionAdvisor.BlogPost] {
    blogPosts.values().toArray().filter(
      func(post) { post.isPublished }
    );
  };

  public query func getBlogPostById(id : Text) : async ?FashionAdvisor.BlogPost {
    switch (blogPosts.get(id)) {
      case (null) { null };
      case (?post) {
        if (post.isPublished) {
          ?post;
        } else {
          null;
        };
      };
    };
  };

  public query func getPublishedPortfolioItems() : async [FashionAdvisor.PortfolioItem] {
    portfolioItems.values().toArray().filter(
      func(item) { item.isPublished }
    );
  };

  public query func getPortfolioItemById(id : Text) : async ?FashionAdvisor.PortfolioItem {
    switch (portfolioItems.get(id)) {
      case (null) { null };
      case (?item) {
        if (item.isPublished) {
          ?item;
        } else {
          null;
        };
      };
    };
  };

  public query func getActiveServices() : async [FashionAdvisor.Service] {
    services.values().toArray().filter(
      func(service) { service.isActive }
    );
  };

  // Admin functions - require admin role
  public shared ({ caller }) func createBlogPost(post : FashionAdvisor.BlogPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func updateBlogPost(post : FashionAdvisor.BlogPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func deleteBlogPost(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    blogPosts.remove(id);
  };

  public shared ({ caller }) func createPortfolioItem(item : FashionAdvisor.PortfolioItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create portfolio items");
    };
    portfolioItems.add(item.id, item);
  };

  public shared ({ caller }) func updatePortfolioItem(item : FashionAdvisor.PortfolioItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update portfolio items");
    };
    portfolioItems.add(item.id, item);
  };

  public shared ({ caller }) func deletePortfolioItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete portfolio items");
    };
    portfolioItems.remove(id);
  };

  public shared ({ caller }) func createService(service : FashionAdvisor.Service) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create services");
    };
    services.add(service.id, service);
  };

  public shared ({ caller }) func updateService(service : FashionAdvisor.Service) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };
    services.add(service.id, service);
  };

  public shared ({ caller }) func deleteService(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete services");
    };
    services.remove(id);
  };

  public shared ({ caller }) func toggleBlogPostPublish(id : Text, isPublished : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle blog post publish status");
    };
    switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) {
        let updatedPost = {
          post with isPublished;
        };
        blogPosts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func togglePortfolioItemPublish(id : Text, isPublished : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle portfolio item publish status");
    };
    switch (portfolioItems.get(id)) {
      case (null) { Runtime.trap("Portfolio item not found") };
      case (?item) {
        let updatedItem = {
          item with isPublished;
        };
        portfolioItems.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func toggleServiceActive(id : Text, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle service active status");
    };
    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) {
        let updatedService = {
          service with isActive;
        };
        services.add(id, updatedService);
      };
    };
  };

  public query ({ caller }) func getAllBookingRequests() : async [FashionAdvisor.BookingRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all booking requests");
    };
    bookingRequests.values().toArray();
  };

  public shared ({ caller }) func updateBookingRequestStatus(id : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking request status");
    };
    switch (bookingRequests.get(id)) {
      case (null) { Runtime.trap("Booking request not found") };
      case (?request) {
        let updatedRequest = {
          request with status;
        };
        bookingRequests.add(id, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func subscribeToNewsletter(id : Text, name : Text, email : Text) : async () {
    let existingSub = newsletterSubscriptions.values().find(func(sub) { sub.email == email });
    switch (existingSub) {
      case (?_) { Runtime.trap("Already subscribed with this email") };
      case (null) {
        let subscription = {
          id;
          name;
          email;
          subscribedAt = Time.now();
        };
        newsletterSubscriptions.add(id, subscription);
      };
    };
  };

  public shared ({ caller }) func submitBookingRequest(request : FashionAdvisor.BookingRequest) : async () {
    bookingRequests.add(request.id, request);
  };
};
