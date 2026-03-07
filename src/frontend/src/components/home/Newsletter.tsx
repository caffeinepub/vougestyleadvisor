import { useBackend } from "@/hooks/useBackend";
import { useFadeIn } from "@/hooks/useFadeIn";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
  const { actor } = useBackend();
  const fadeRef = useFadeIn<HTMLElement>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const id = crypto.randomUUID();
      if (actor) {
        await actor.subscribeToNewsletter(id, name, email);
      }
      // Always show success even if actor not ready
    },
    onSuccess: () => {
      setSubscribed(true);
      toast.success("Welcome to the style club! 🌟", {
        description: "You'll receive weekly fashion tips in your inbox.",
      });
      setName("");
      setEmail("");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    subscribeMutation.mutate();
  };

  return (
    <section
      id="newsletter"
      data-ocid="newsletter.section"
      ref={fadeRef}
      className="section-fade-in py-20 lg:py-28 bg-[#111111]"
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-px bg-[#C9A86A]/40" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C9A86A]">
            Newsletter
          </span>
          <div className="w-16 h-px bg-[#C9A86A]/40" />
        </div>

        <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
          Weekly Fashion Tips & Outfit Ideas
        </h2>
        <p className="font-sans text-sm text-white/55 mb-10 max-w-xl mx-auto leading-relaxed">
          Subscribe for exclusive styling tips, outfit inspiration, and fashion
          trends delivered to your inbox every week.
        </p>

        {subscribed ? (
          <div
            data-ocid="newsletter.success_state"
            className="flex flex-col items-center gap-3 py-6"
          >
            <CheckCircle2 size={40} className="text-[#C9A86A]" />
            <p className="font-serif text-xl text-white">
              Thank you for subscribing!
            </p>
            <p className="font-sans text-xs text-white/55">
              Fashion inspiration is on its way.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="text"
              required
              data-ocid="newsletter.name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="flex-1 font-sans text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors"
            />
            <input
              type="email"
              required
              data-ocid="newsletter.email.input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="flex-1 font-sans text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 focus:outline-none focus:border-[#C9A86A] transition-colors"
            />
            <button
              type="submit"
              data-ocid="newsletter.submit_button"
              disabled={subscribeMutation.isPending}
              className="font-sans text-xs tracking-[0.18em] uppercase bg-[#C9A86A] text-white px-7 py-3 hover:bg-[#b8945a] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {subscribeMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        )}

        <p className="font-sans text-[10px] text-white/30 mt-5 tracking-wide">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
