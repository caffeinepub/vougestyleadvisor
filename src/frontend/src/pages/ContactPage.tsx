import { useFadeIn } from "@/hooks/useFadeIn";
import { saveContactMessage } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  Instagram,
  Loader2,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { SiPinterest } from "react-icons/si";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const formRef = useFadeIn<HTMLDivElement>();
  const infoRef = useFadeIn<HTMLDivElement>();

  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      await saveContactMessage({
        name: data.name,
        email: data.email,
        message: data.message,
        submittedAt: Date.now(),
        isRead: false,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <div className="bg-[#F5F1EB] pt-28 pb-16 px-6 lg:px-8 text-center">
        <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A86A] mb-3">
          Let's Connect
        </p>
        <h1 className="font-serif text-5xl lg:text-6xl text-[#111111] mb-4">
          Contact
        </h1>
        <p className="font-sans text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          Have a project in mind, or just want to say hello? Reach out — Shagun
          would love to hear from you.
        </p>
        <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-6" />
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — Contact Form */}
          <div ref={formRef} className="section-fade-in">
            <h2 className="font-serif text-3xl text-[#111111] mb-2">
              Send a Message
            </h2>
            <div className="w-8 h-px bg-[#C9A86A] mb-8" />

            {submitted ? (
              <div
                data-ocid="contact.success_state"
                className="flex flex-col items-center justify-center text-center py-14 bg-[#F5F1EB]"
              >
                <CheckCircle2 size={44} className="text-[#C9A86A] mb-4" />
                <h3 className="font-serif text-xl text-[#111111] mb-2">
                  Message Sent!
                </h3>
                <p className="font-sans text-sm text-gray-500 max-w-xs leading-relaxed">
                  Message sent! Shagun will get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 font-sans text-xs tracking-[0.15em] uppercase border border-[#111111] text-[#111111] px-6 py-2.5 hover:bg-[#111111] hover:text-white transition-all duration-300"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                  >
                    Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    data-ocid="contact.name_input"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Your name"
                    className="w-full font-sans text-sm border border-gray-200 px-4 py-3.5 focus:outline-none focus:border-[#C9A86A] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    data-ocid="contact.email_input"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                    className="w-full font-sans text-sm border border-gray-200 px-4 py-3.5 focus:outline-none focus:border-[#C9A86A] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="font-sans text-xs tracking-wide uppercase text-gray-600 block mb-1.5"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    data-ocid="contact.message_textarea"
                    rows={6}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Tell me about your project, styling needs, or just say hello..."
                    className="w-full font-sans text-sm border border-gray-200 px-4 py-3.5 focus:outline-none focus:border-[#C9A86A] transition-colors resize-none"
                  />
                </div>

                {submitMutation.isError && (
                  <p className="font-sans text-xs text-red-500">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  data-ocid="contact.submit_button"
                  disabled={submitMutation.isPending}
                  className="w-full font-sans text-sm tracking-[0.15em] uppercase bg-[#111111] text-white py-4 hover:bg-[#C9A86A] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={14} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right — Contact Info */}
          <div ref={infoRef} className="section-fade-in flex flex-col gap-8">
            <div>
              <h2 className="font-serif text-3xl text-[#111111] mb-2">
                Get in Touch
              </h2>
              <div className="w-8 h-px bg-[#C9A86A] mb-6" />
              <p className="font-sans text-sm text-gray-500 leading-loose">
                Whether you're looking for fashion advice, want to book a
                service, or explore a collaboration, I'd love to connect.
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              <a
                href="mailto:vougestyleadvisor@gmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 flex items-center justify-center border border-gray-200 group-hover:border-[#C9A86A] transition-colors">
                  <Mail
                    size={16}
                    className="text-gray-400 group-hover:text-[#C9A86A] transition-colors"
                  />
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-0.5">
                    Email
                  </p>
                  <p className="font-sans text-sm text-[#111111]">
                    vougestyleadvisor@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://instagram.com/vougestyleadvisor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 flex items-center justify-center border border-gray-200 group-hover:border-[#C9A86A] transition-colors">
                  <Instagram
                    size={16}
                    className="text-gray-400 group-hover:text-[#C9A86A] transition-colors"
                  />
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-0.5">
                    Instagram
                  </p>
                  <p className="font-sans text-sm text-[#111111]">
                    @vougestyleadvisor
                  </p>
                </div>
              </a>

              <a
                href="https://pinterest.com/vougestyleadvisor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 flex items-center justify-center border border-gray-200 group-hover:border-[#C9A86A] transition-colors">
                  <SiPinterest
                    size={15}
                    className="text-gray-400 group-hover:text-[#C9A86A] transition-colors"
                  />
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-0.5">
                    Pinterest
                  </p>
                  <p className="font-sans text-sm text-[#111111]">
                    @vougestyleadvisor
                  </p>
                </div>
              </a>
            </div>

            {/* Business Inquiry box */}
            <div className="bg-[#111111] p-7 mt-2">
              <h3 className="font-serif text-lg text-white mb-3">
                Business Inquiries
              </h3>
              <p className="font-sans text-xs text-white/55 leading-loose">
                For brand collaborations, styling services, or fashion
                consultations, please reach out using the form or email directly
                at{" "}
                <a
                  href="mailto:vougestyleadvisor@gmail.com"
                  className="text-[#C9A86A] hover:underline"
                >
                  vougestyleadvisor@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
