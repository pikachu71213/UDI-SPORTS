import { FaHandHoldingHeart, FaUsers, FaUniversity } from "react-icons/fa";

export default function DonateNow() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#0B1E4B] mb-4">
            Contribute to UDIISA and Support Future Champions
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto">
            Your contribution helps talented and gifted sports players across
            India receive financial support, professional training, mentorship
            and opportunities to become future champions.
          </p>
        </div>
{/* Bank Details */}
        <div className="bg-white rounded-xl shadow-sm p-8">

          <h2 className="text-xl font-semibold text-[#0B1E4B] mb-6">
            Donation Bank Details
          </h2>

          {/* SBI Account */}
          <div className="grid md:grid-cols-2 gap-6 text-slate-600 mb-8">
            <div>
              <p><strong>Account Holder:</strong> UDI International Sports Association</p>
              <p><strong>Account Number:</strong> 44888264603</p>
              <p><strong>Bank Name:</strong> State Bank of India</p>
              <p><strong>IFSC Code:</strong> SBIN0011864</p>
            </div>

            <div>
              <p><strong>Email:</strong> info@udisports.in</p>
              <p><strong>Accounts Email:</strong> accounts@udisports.in</p>
              <p><strong>Phone:</strong> +91-8307598050</p>
              <p>
                <strong>Office Address:</strong> 5091, 9th Floor Tower-5 Parkar
                Residency, GT Road, Tehsil Rai, District Sonipat
              </p>
            </div>
          </div>

          {/* HDFC Account (new card) */}
          <div className="grid md:grid-cols-2 gap-6 text-slate-600 border-t border-slate-200 pt-8">
            <div>
              <p><strong>Account Holder:</strong> UDI INTERNATIONALSPORTS ASSOCIATION (Regd)</p>
              <p><strong>Account Number:</strong> 50200119285680</p>
              <p><strong>Bank Name:</strong> HDFC Bank</p>
              <p><strong>MICR Code:</strong> 127240002</p>
              <p><strong>IFSC Code:</strong> HDFC0000479</p>
            </div>

            <div>
              <p><strong>Email:</strong> info@udisports.in</p>
              <p><strong>Accounts Email:</strong> accounts@udisports.in</p>
              <p><strong>Phone:</strong> +91-8307598050</p>
              <p>
                <strong>Office Address:</strong> 5091, 9th Floor Tower-5 Parkar
                Residency, GT Road, Tehsil Rai, District Sonipat
              </p>
            </div>
          </div>

        </div>
        {/* Organization Mission */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-xl font-semibold text-[#0B1E4B] mb-4">
            About UDIISA
          </h2>

          <p className="text-slate-600 leading-relaxed mb-4">
            United For Dynamic India (UDI) International Sports Association
            (UDIISA) is a non-profit, non-governmental, non-political and
            charitable organization committed to promoting and supporting
            talented and gifted sports players across India.
          </p>

          <p className="text-slate-600 leading-relaxed">
            Our mission is to identify promising players and encourage them to
            become members of our association. We provide financial assistance,
            training camps, academy admissions, mentorship, tournament
            participation and professional guidance to help them develop their
            skills and compete at National and International levels.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <FaHandHoldingHeart className="text-3xl text-blue-600 mx-auto mb-3"/>
            <h3 className="font-semibold mb-2">Support Future Champions</h3>
            <p className="text-sm text-slate-600">
              Your donation helps talented players overcome financial barriers
              and pursue their sports dreams with confidence.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <FaUsers className="text-3xl text-blue-600 mx-auto mb-3"/>
            <h3 className="font-semibold mb-2">Training & Development</h3>
            <p className="text-sm text-slate-600">
              Contributions help provide coaching, mentorship, academy
              admission, training camps and tournament participation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <FaUniversity className="text-3xl text-blue-600 mx-auto mb-3"/>
            <h3 className="font-semibold mb-2">Transparent System</h3>
            <p className="text-sm text-slate-600">
              We follow strict financial transparency and ensure that every
              donation is used responsibly for sports development.
            </p>
          </div>

        </div>

        {/* Why Donation Matters */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">

          <h2 className="text-xl font-semibold text-[#0B1E4B] mb-4">
            Why Your Contribution Matters
          </h2>

          <p className="text-slate-600 mb-4">
            Many talented sports players are unable to continue their journey
            due to lack of resources. Through our initiative we aim to reduce
            economic barriers and provide deserving players with opportunities
            for improvement and growth in their respective games.
          </p>

          <p className="text-slate-600 mb-4">
            Your contribution enables players to receive professional training,
            coaching, sports equipment, tournament participation and other
            essential support required to compete at National and International
            levels.
          </p>

          <p className="text-slate-600">
            Contributions made to UDIISA are eligible for tax rebate under
            Section 80G of the Income Tax Act.
          </p>
        </div>

        {/* Partnership Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">

          <h2 className="text-xl font-semibold text-[#0B1E4B] mb-4">
            Join Hands With Us
          </h2>

          <p className="text-slate-600 mb-4">
            Our mission is to collaborate with industrialists, entrepreneurs,
            dignitaries, celebrities and former sports players to support the
            next generation of champions.
          </p>

          <p className="text-slate-600">
            Together we can empower talented players by supporting their
            training, development and opportunities for growth in sports.
          </p>

        </div>

        {/* Who Can Donate */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">

          <h2 className="text-xl font-semibold text-[#0B1E4B] mb-4">
            Who Can Contribute
          </h2>

          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Individual Donors</li>
            <li>Corporate Organizations</li>
            <li>CSR Partnerships</li>
            <li>Industrialists and Entrepreneurs</li>
            <li>Former Sports Players</li>
            <li>Foundations and Trusts</li>
            <li>Government and Non-Government Officers</li>
            <li>Philanthropic Institutions</li>
          </ul>

          <p className="text-slate-600 mt-4">
            A donation receipt and 80G certificate will be issued for tax
            purposes. All funds will be utilized strictly for the development
            and promotion of sports talent.
          </p>

        </div>

        {/* Transparency */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">

          <h2 className="text-xl font-semibold text-[#0B1E4B] mb-4">
            Transparency & Accountability
          </h2>

          <p className="text-slate-600">
            UDIISA follows strict financial transparency and accountability
            practices. Every contribution is utilized responsibly for the
            development and promotion of talented players. Proper records,
            reports and accounting are maintained to ensure that funds are
            used effectively and ethically.
          </p>

        </div>

        

      </div>
    </div>
  );
}