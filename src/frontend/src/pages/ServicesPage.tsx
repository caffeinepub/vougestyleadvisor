import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type FirebaseService,
  getActiveServices,
  saveBooking,
} from "@/lib/firebase";
import { SAMPLE_SERVICES } from "@/lib/sampleData";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";

const SERVICE_ICONS = [Sparkles, CalendarDays, Star];

interface BookingFormState {
  fullName: string;
  email: string;
  whatsapp: string;
  serviceId: string;
  message: string;
}

// Map FirebaseService to the shape the rest of the UI expects
interface DisplayService {
  id: string;
  title: string;
  description: string;
  price: string;
  isActive: boolean;
}

export default function ServicesPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<DisplayService | null>(
    null,
  );
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<BookingFormState>({
    fullName: "",
    email: "",
    whatsapp: "",
    serviceId: "",
    message: "",
  });

  const { data: firebaseServices } = useQuery<FirebaseService[]>({
    queryKey: ["activeServices"],
    queryFn: getActiveServices,
  });

  // Merge sample data with Firebase data (Firebase wins if available)
  const allServices: DisplayService[] =
    firebaseServices && firebaseServices.length > 0
      ? firebaseServices
      : (SAMPLE_SERVICES as DisplayService[]);

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormState) => {
      await saveBooking({
        fullName: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,
        serviceId: data.serviceId || "general",
        message: data.message,
        status: "pending",
        submittedAt: Date.now(),
      });
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const openBooking = (service: DisplayService) => {
    setSelectedService(service);
    setForm({
      fullName: "",
      email: "",
      whatsapp: "",
      serviceId: service.id,
      message: "",
    });
    setSubmitted(false);
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
    setSubmitted(false);
    setSelectedService(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <div className="bg-[#F5F1EB] pt-28 pb-16 px-6 lg:px-8 text-center">
        <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A86A] mb-3">
          Work with Me
        </p>
        <h1 className="font-serif text-5xl lg:text-6xl text-[#111111] mb-4">
          Services
        </h1>
        <p className="font-sans text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          Professional fashion styling services tailored to your unique style,
          personality, and occasions.
        </p>
        <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-6" />
      </div>

      {/* Services Grid */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {allServices.map((service, idx) => {
            const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
            return (
              <div
                key={service.id}
                data-ocid={`services.item.${idx + 1}`}
                className="group border border-gray-100 p-8 hover:border-[#C9A86A] hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="w-14 h-14 flex items-center justify-center border border-[#C9A86A]/25 group-hover:bg-[#F5F1EB] transition-colors duration-300 mb-6">
                  <Icon size={24} className="text-[#C9A86A]" />
                </div>

                <h2 className="font-serif text-2xl text-[#111111] mb-3">
                  {service.title}
                </h2>
                <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>

                <div className="border-t border-gray-100 pt-6 mt-auto">
                  <p className="font-serif text-3xl text-[#C9A86A] mb-5">
                    {service.price}
                  </p>
                  <button
                    type="button"
                    data-ocid={`services.book_now_button.${idx + 1}`}
                    onClick={() => openBooking(service)}
                    className="w-full font-sans text-xs tracking-[0.15em] uppercase bg-[#111111] text-white py-3.5 hover:bg-[#C9A86A] transition-all duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Section */}
        <div className="bg-[#111111] p-10 lg:p-14 text-center mb-12">
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A86A] mb-3">
            How It Works
          </p>
          <h2 className="font-serif text-3xl text-white mb-10">
            Simple 3-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Book a Session",
                desc: "Fill out the booking form with your details and styling needs.",
              },
              {
                step: "02",
                title: "Consultation",
                desc: "A personalized session to understand your style, goals, and preferences.",
              },
              {
                step: "03",
                title: "Style Transformation",
                desc: "Receive your curated style guide, outfit ideas, and fashion advice.",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <p className="font-serif text-4xl text-[#C9A86A]/40 mb-3">
                  {step.step}
                </p>
                <h3 className="font-serif text-lg text-white mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-white/50 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment note */}
        <div className="text-center py-6 border-t border-gray-100">
          <p className="font-sans text-xs text-gray-400 leading-relaxed">
            Payment accepted via UPI, Google Pay, PhonePe, Paytm, or Razorpay.
            <br />
            <span className="text-[#C9A86A]">
              No advance payment required — pay after your consultation.
            </span>
          </p>
        </div>
      </main>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={(v) => !v && closeBooking()}>
        <DialogContent
          data-ocid="services.booking_dialog"
          className="max-w-lg max-h-[90vh] overflow-y-auto p-0"
        >
          <div className="p-7">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-serif text-2xl text-[#111111]">
                Book a Consultation
              </DialogTitle>
              {selectedService && (
                <p className="font-sans text-xs text-[#C9A86A] tracking-wide mt-1">
                  {selectedService.title} — {selectedService.price}
                </p>
              )}
            </DialogHeader>

            {submitted ? (
              <div
                data-ocid="services.booking_form.success_state"
                className="text-center py-10"
              >
                <CheckCircle2
                  size={48}
                  className="text-[#C9A86A] mx-auto mb-4"
                />
                <h3 className="font-serif text-xl text-[#111111] mb-2">
                  Request Submitted!
                </h3>
                <p className="font-sans text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Thank you! Your booking request has been submitted. Shagun
                  will contact you soon.
                </p>
                <button
                  type="button"
                  data-ocid="services.booking_dialog.close_button"
                  onClick={closeBooking}
                  className="mt-6 font-sans text-xs tracking-[0.15em] uppercase bg-[#C9A86A] text-white px-8 py-3 hover:bg-[#b8945a] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                data-ocid="services.booking_form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="svc-full-name"
                    className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="svc-full-name"
                    type="text"
                    required
                    data-ocid="services.booking_form.name_input"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                    placeholder="Your full name"
                    className="w-full font-sans text-sm border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="svc-email"
                    className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="svc-email"
                    type="email"
                    required
                    data-ocid="services.booking_form.email_input"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                    className="w-full font-sans text-sm border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="svc-whatsapp"
                    className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                  >
                    WhatsApp Number *
                  </label>
                  <input
                    id="svc-whatsapp"
                    type="tel"
                    required
                    data-ocid="services.booking_form.whatsapp_input"
                    value={form.whatsapp}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, whatsapp: e.target.value }))
                    }
                    placeholder="+91 98765 43210"
                    className="w-full font-sans text-sm border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="svc-service"
                    className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                  >
                    Service Selected
                  </label>
                  <select
                    id="svc-service"
                    data-ocid="services.booking_form.select"
                    value={form.serviceId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, serviceId: e.target.value }))
                    }
                    className="w-full font-sans text-sm border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors bg-white"
                  >
                    <option value="">Select a service</option>
                    {allServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} — {s.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="svc-message"
                    className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                  >
                    Message / Styling Request
                  </label>
                  <textarea
                    id="svc-message"
                    data-ocid="services.booking_form.message_textarea"
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Tell me about your styling needs, upcoming events, or any specific requirements..."
                    className="w-full font-sans text-sm border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors resize-none"
                  />
                </div>

                {bookingMutation.isError && (
                  <p
                    data-ocid="services.booking_form.error_state"
                    className="font-sans text-xs text-red-500"
                  >
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  data-ocid="services.booking_form.submit_button"
                  disabled={bookingMutation.isPending}
                  className="w-full font-sans text-sm tracking-[0.15em] uppercase bg-[#111111] text-white py-4 hover:bg-[#C9A86A] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                >
                  {bookingMutation.isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={14} />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="services.whatsapp_button"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#20ba5a] transition-all duration-300 hover:scale-110"
        style={{ borderRadius: "50%" }}
      >
        <SiWhatsapp size={26} />
      </a>
    </div>
  );
}
