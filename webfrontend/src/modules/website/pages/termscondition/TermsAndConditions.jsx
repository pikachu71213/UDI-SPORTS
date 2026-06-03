import { useState } from "react";

const sections = [
  {
    id: "intro",
    icon: "🏆",
    title: "Introduction",
    content: `United Dynamic India International Sports Association (UDIISA) is a non-government, non-profitable, non-political and charitable organization. Talented and gifted players can get all requisite assistance including financial, physical and educational training camps, sponsorship for tournaments, and other timely support based on performance evaluation.

A special coordination and development committee consisting of experts with practical and theoretical experience is constituted to identify talented players for future champions. UDIISA provides lifetime membership on nominal subscription including extra benefits for EWS category players.

Apply via: info@udisports.in | accounts@udisports.in | udisports.in`,
  },
  {
    id: "legal",
    icon: "⚖️",
    title: "Legal Status",
    badges: [
      { label: "Reg. Under", value: "Section 8(1) – Companies Act 2013" },
      { label: "License No.", value: "179321" },
      { label: "CIN", value: "U94990HR2026NPL141182" },
      { label: "PAN", value: "AAECU0648K" },
      { label: "TAN", value: "RTKU03726C" },
      { label: "Darpan ID", value: "HR/2026/0985401" },
      { label: "Form 10C Cert.", value: "AAECU0648KE20251" },
    ],
    content: `UDIISA is a Non-Governmental Organization registered by the Ministry of Corporate Affairs (MCA) dated 29.01.2026. Requisite permissions under Section 80G and 12A of the Income Tax Act have also been sanctioned.`,
  },
  {
    id: "eligibility",
    icon: "✅",
    title: "Eligibility for Sponsorship",
    list: [
      "Applicant must be an Indian Player",
      "Must provide valid identity proof",
      "Must submit genuine sports achievement documents",
      "Date of Birth proof required",
    ],
    content: `If false information is found, UDIISA reserves the right to reject the application or request additional documents. Violation of terms may result in immediate termination of membership and sponsorship without notice.`,
  },
  {
    id: "sponsorship",
    icon: "🎽",
    title: "Sponsorship Terms",
    content: `If selected, sponsorship covers training, equipment, travel, and related expenses. Misuse of funds may lead to immediate termination of sponsorship.

Performance reports must be submitted twice a year by players, coaches, or academy heads. Players shall display the UDIISA logo during national and international matches and comply with social media acknowledgment directives.`,
    disclaimer: [
      "National/International selection",
      "Medal winning",
      "Career outcome",
    ],
    disclaimerLabel: "UDIISA does NOT guarantee:",
  },
  {
    id: "donation",
    icon: "💚",
    title: "Donation Policy",
    list: [
      "All donations are voluntary",
      "Donations are non-refundable unless legally barred",
      "Funds are used exclusively for sports development",
      "Tax exemption under 80G / 12A is applicable",
    ],
  },
  {
    id: "website",
    icon: "🌐",
    title: "Website Use Policy",
    content: "By using our website, no member or player shall:",
    list: [
      "Submit false information",
      "Upload harmful content",
      "Attempt hacking or unauthorized access",
      "Use content without permission",
    ],
    content2:
      "UDIISA reserves the right to suspend user access, remove content, and take legal action if required.",
  },
  {
    id: "ip",
    icon: "©️",
    title: "Intellectual Property",
    list: [
      "Website content, logo, graphics, and documents are property of UDIISA",
      "Unauthorized reproduction is strictly prohibited",
      "Legal action may be taken under the Copyright Act, 1957",
    ],
  },
  {
    id: "privacy",
    icon: "🔒",
    title: "Privacy & Data Protection",
    content:
      "We collect: Name, Father's Name, Contact Details, ID Proof, and Sports Records. This data is used only for sponsorship evaluation, communication, and legal compliance.",
    content2:
      "UDIISA follows the Information Technology Act, 2000 and SPDI Rules. We do not sell personal data.",
  },
  {
    id: "conduct",
    icon: "🤝",
    title: "Code of Conduct",
    list: [
      "Maintain discipline at all times",
      "Avoid doping in any form",
      "Follow sports ethics",
      "Respect sponsors and officials",
      "Maintain positive public conduct",
    ],
    content: "Violation may lead to cancellation of sponsorship and legal action.",
  },
  {
    id: "liability",
    icon: "🛡️",
    title: "Liability Disclaimer",
    list: [
      "Injury during sports activities",
      "Performance failure",
      "Selection rejection by authorities",
      "Third-party disputes",
      "Participation without recommendation (at own risk)",
    ],
    disclaimerLabel: "UDIISA shall NOT be liable for:",
    listIsDisclaimer: true,
  },
  {
    id: "law",
    icon: "🏛️",
    title: "Governing Law & Jurisdiction",
    content:
      "These Terms shall be governed by the Laws of India. All disputes are subject to the applicable jurisdiction of courts in India.",
  },
  {
    id: "amendments",
    icon: "📝",
    title: "Amendments",
    content:
      "UDIISA reserves the right to modify these Terms and Conditions at any time. Users are responsible for reviewing updates regularly.",
  },
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState(null);
  const [accepted, setAccepted] = useState(false);

  const toggle = (id) => setActiveSection(activeSection === id ? null : id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white font-sans">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30 rounded-full px-4 py-1 text-blue-300 text-sm mb-6 tracking-widest uppercase">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse inline-block" />
            Official Document
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-3 bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            UDIISA
          </h1>
          <p className="text-lg text-blue-200 mb-1 font-medium">
            United Dynamic India International Sports Association
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Terms & Conditions · Privacy Policy · Code of Conduct
          </p>
          <div className="flex justify-center gap-6 text-xs text-slate-400 flex-wrap">
            <span>📧 info@udisports.in</span>
            <span>📞 +91-8307598050</span>
            <span>🌐 udisports.in</span>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="max-w-4xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                toggle(s.id);
                setTimeout(() => {
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 50);
              }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                activeSection === s.id
                  ? "bg-blue-500 border-blue-400 text-white"
                  : "border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-300"
              }`}
            >
              {s.icon} {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 pb-10 space-y-3">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            id={section.id}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              activeSection === section.id
                ? "border-blue-500 border-opacity-60 bg-blue-950 bg-opacity-40"
                : "border-slate-700 border-opacity-50 bg-slate-800 bg-opacity-30 hover:border-slate-500"
            }`}
          >
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <div>
                  <span className="text-xs text-slate-500 font-mono">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-white font-bold text-base group-hover:text-blue-300 transition-colors">
                    {section.title}
                  </h2>
                </div>
              </div>
              <span
                className={`text-slate-400 transition-transform duration-300 text-lg ${
                  activeSection === section.id ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            {activeSection === section.id && (
              <div className="px-6 pb-6 border-t border-slate-700 border-opacity-50 pt-4 space-y-4">
                {/* Legal Badges */}
                {section.badges && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {section.badges.map((b) => (
                      <div
                        key={b.label}
                        className="flex items-start gap-3 bg-slate-900 bg-opacity-60 rounded-xl px-4 py-3 border border-slate-700"
                      >
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-0.5 w-24 shrink-0">
                          {b.label}
                        </span>
                        <span className="text-slate-200 text-sm font-mono">
                          {b.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Main content */}
                {section.content && (
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                )}

                {/* Disclaimer label + list */}
                {section.disclaimerLabel && (
                  <div className={`rounded-xl px-4 py-3 border ${section.listIsDisclaimer ? "bg-red-950 bg-opacity-30 border-red-800 border-opacity-40" : "bg-amber-950 bg-opacity-30 border-amber-700 border-opacity-40"}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${section.listIsDisclaimer ? "text-red-400" : "text-amber-400"}`}>
                      {section.disclaimerLabel}
                    </p>
                    <ul className="space-y-1">
                      {(section.disclaimer || section.list).map((item) => (
                        <li key={item} className={`text-sm flex items-start gap-2 ${section.listIsDisclaimer ? "text-red-200" : "text-amber-200"}`}>
                          <span className="mt-1 shrink-0">{section.listIsDisclaimer ? "✗" : "⚠"}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Regular list (non-disclaimer) */}
                {section.list && !section.disclaimerLabel && (
                  <ul className="space-y-2">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Second content block */}
                {section.content2 && (
                  <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-700 pt-3">
                    {section.content2}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Accept Footer */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border border-slate-600 bg-slate-800 bg-opacity-40 p-6 text-center">
          <p className="text-slate-400 text-sm mb-4">
            By using UDIISA services, you agree to all the above Terms & Conditions.
          </p>
          <label className="inline-flex items-center gap-3 cursor-pointer group mb-5">
            <div
              onClick={() => setAccepted(!accepted)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                accepted
                  ? "bg-blue-500 border-blue-500"
                  : "border-slate-500 group-hover:border-blue-400"
              }`}
            >
              {accepted && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-slate-300 text-sm">
              I have read and accept the Terms & Conditions
            </span>
          </label>
          <br />
          <button
            disabled={!accepted}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
              accepted
                ? "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            Continue to UDIISA Portal →
          </button>
        </div>

        {/* Footer address */}
        <p className="text-center text-slate-600 text-xs mt-6">
          5091, 9th Floor Tower-5, Parkar Residency, GT Road, Tehsil Rai, District Sonipat · Haryana, India
        </p>
      </div>
    </div>
  );
}