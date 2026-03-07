import { useFadeIn } from "@/hooks/useFadeIn";
import {
  type FirebaseService,
  getActiveServices,
  saveBooking,
} from "@/lib/firebase";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DisplayService {
  id: string;
  title: string;
  description: string;
  price: string;
}

const SERVICE_ICONS = [Sparkles, CalendarDays, Star];

const FALLBACK_SERVICES: DisplayService[] = [
  {
    id: "1",
    title: "Personal Styling Advice",
    description:
      "Personalized fashion advice tailored to your body type and personality.",
    price: "₹199",
  },
  {
    id: "2",
    title: "Outfit Planning",
    description:
      "Complete outfit suggestions for events, daily wear, or special occasions.",
    price: "₹399",
  },
  {
    id: "3",
    title: "Event Styling",
    description: "Full styling guidance for weddings, parties, or photoshoots.",
    price: "₹699",
  },
];

interface BookingFormData {
  fullName: string;
  email: string;
  whatsapp: string;
  serviceId: string;
  message: string;
}

export default function ServicesHighlight() {
  const fadeRef = useFadeIn<HTMLElement>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<BookingFormData>({
    fullName: "",
    email: "",
    whatsapp: "",
    serviceId: "",
    message: "",
  });

  const { data: backendServices } = useQuery<FirebaseService[]>({
    queryKey: ["activeServices"],
    queryFn: getActiveServices,
  });

  const services: DisplayService[] =
    backendServices && backendServices.length > 0
      ? backendServices.slice(0, 3).map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          price: s.price,
        }))
      : FALLBACK_SERVICES;

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
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

  const openModal = (serviceId = "") => {
    setPreSelectedService(serviceId);
    setForm((prev) => ({ ...prev, serviceId }));
    setSubmitted(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSubmitted(false);
    setForm({
      fullName: "",
      email: "",
      whatsapp: "",
      serviceId: "",
      message: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate(form);
  };

  return (
    <>
      <section
        id="services"
        data-ocid="services.section"
        ref={fadeRef}
        className="section-fade-in py-20 lg:py-28 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A86A] mb-3">
              Hire Me
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-[#111111] mb-4">
              My Services
            </h2>
            <p className="font-sans text-sm text-gray-500 tracking-wide">
              Professional styling for every occasion
            </p>
            <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-6" />
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {services.map((service, idx) => {
              const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
              return (
                <div
                  key={service.id}
                  data-ocid={`services.item.${idx + 1}`}
                  className="group text-center border border-gray-100 p-8 hover:border-[#C9A86A] hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-5 border border-[#C9A86A]/30 group-hover:bg-[#F5F1EB] transition-colors duration-300">
                    <Icon size={22} className="text-[#C9A86A]" />
                  </div>
                  <h3 className="font-serif text-xl text-[#111111] mb-3">
                    {service.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <p className="font-serif text-2xl text-[#C9A86A] mb-6">
                    {service.price}
                  </p>
                  <button
                    type="button"
                    data-ocid="services.book_button"
                    onClick={() => openModal(service.id)}
                    className="font-sans text-xs tracking-[0.15em] uppercase border border-[#111111] text-[#111111] px-6 py-2.5 hover:bg-[#111111] hover:text-white transition-all duration-300"
                  >
                    Book Now
                  </button>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              type="button"
              data-ocid="services.open_modal_button"
              onClick={() => navigate("/services")}
              className="font-sans text-sm tracking-[0.15em] uppercase bg-[#C9A86A] text-white px-10 py-4 hover:bg-[#b8945a] transition-all duration-300 hover:scale-[1.02] shadow-md"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click to close */}
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div
            data-ocid="services.modal"
            className="relative bg-white w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#111111]">
                    Book a Consultation
                  </h3>
                  <p className="font-sans text-xs text-gray-400 mt-1 tracking-wide">
                    Fill in your details and Shagun will reach out shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-[#111111] transition-colors ml-4 mt-1"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-10">
                  <CheckCircle2
                    size={48}
                    className="text-[#C9A86A] mx-auto mb-4"
                  />
                  <h4 className="font-serif text-xl text-[#111111] mb-2">
                    Request Submitted!
                  </h4>
                  <p className="font-sans text-sm text-gray-500">
                    Your request has been submitted! Shagun will get back to you
                    soon.
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-6 font-sans text-xs tracking-[0.15em] uppercase bg-[#C9A86A] text-white px-8 py-3 hover:bg-[#b8945a] transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      data-ocid="booking.input"
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
                      htmlFor="booking-email"
                      className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      required
                      data-ocid="booking.email.input"
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
                      htmlFor="booking-whatsapp"
                      className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                    >
                      WhatsApp Number *
                    </label>
                    <input
                      id="booking-whatsapp"
                      type="tel"
                      required
                      data-ocid="booking.whatsapp.input"
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
                      htmlFor="booking-service"
                      className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                    >
                      Service
                    </label>
                    <select
                      id="booking-service"
                      data-ocid="booking.select"
                      value={form.serviceId || preSelectedService}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, serviceId: e.target.value }))
                      }
                      className="w-full font-sans text-sm border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors bg-white"
                    >
                      <option value="">Select a service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} — {s.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-message"
                      className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                    >
                      Message / Styling Request
                    </label>
                    <textarea
                      id="booking-message"
                      data-ocid="booking.textarea"
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="Tell me about your styling needs..."
                      className="w-full font-sans text-sm border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors resize-none"
                    />
                  </div>

                  {bookingMutation.isError && (
                    <p
                      data-ocid="services.error_state"
                      className="font-sans text-xs text-red-500"
                    >
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    data-ocid="services.submit_button"
                    disabled={bookingMutation.isPending}
                    className="w-full font-sans text-sm tracking-[0.15em] uppercase bg-[#111111] text-white py-4 hover:bg-[#C9A86A] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {bookingMutation.isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
