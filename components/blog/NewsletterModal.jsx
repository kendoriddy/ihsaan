import { useState } from "react";

export default function NewsletterModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple email validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSuccess(true);
    // Here you would send to backend
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {success ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-4xl mb-2">✓</div>
            <h2 className="text-xl font-bold mb-2">Subscribed!</h2>
            <p className="text-gray-600">
              Thank you for subscribing to our newsletter.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#7e1a0b] mb-2 text-center">
              Subscribe to our Newsletter
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Get the latest blog updates, notifications, and exclusive offers
              straight to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff6600] text-base"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="bg-[#ff6600] hover:bg-[#e55a00] text-white font-semibold rounded-lg py-3 transition-colors text-lg shadow"
              >
                Subscribe
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
