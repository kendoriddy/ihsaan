import { useState, useEffect } from "react";
import axios from "axios";

export default function FAQSection() {
  const [openId, setOpenId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

      
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.ihsaanacademia.com/api";


const faqBaseUrl = apiBase.endsWith("/api") 
    ? apiBase.slice(0, -4) 
    : "https://api.ihsaanacademia.com";




        const response = await axios.get(`${faqBaseUrl}/faqs/faq/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setFaqs(response.data.results || []);
      } catch (err) {
        setError("Failed to load FAQs");
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <section id="faqs"  className="py-12 bg-white">
        <div
          className="text-center mb-6 font-semibold text-3xl"
          style={{ color: "#7e1a0b" }}
        >
          Frequently Asked Questions
        </div>
        <div className="w-full max-w-3xl mx-auto text-center">
          <div className="text-gray-600">Loading FAQs...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="faqs"  className="py-12 bg-white">
        <div
          className="text-center mb-6 font-semibold text-3xl"
          style={{ color: "#7e1a0b" }}
        >
          Frequently Asked Questions
        </div>
        <div className="w-full max-w-3xl mx-auto text-center">
          <div className="text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="faqs" className="py-12 bg-white">
      <div
        className="text-center mb-6 font-semibold text-3xl"
        style={{ color: "#7e1a0b" }}
      >
        Frequently Asked Questions
      </div>
      <div className="w-full max-w-3xl mx-auto">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="mb-4 border rounded-md shadow-sm bg-gray-50 border-[1.5px] border-[#ff6600]"
            >
              <button
                className="w-full flex justify-between items-center px-6 py-4 focus:outline-none text-left"
                onClick={() => toggle(faq.id)}
                aria-expanded={openId === faq.id}
                style={{ color: "#7e1a0b", fontWeight: 600 }}
              >
                <span>{faq.question}</span>
                <span
                  className={`ml-4 transition-transform duration-200 ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                  style={{ color: "#ff6600", fontWeight: 700 }}
                >
                  ▼
                </span>
              </button>
              {openId === faq.id && (
                <div className="px-6 pb-4 text-gray-700 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">
            No FAQs available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
