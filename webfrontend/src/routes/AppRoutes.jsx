import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Preloader } from "../modules/website/components/Globalenhancer";
import MatchDetailPage from "../modules/website/pages/matchpage/Matchdetailpage";
import EventsPage from "../modules/website/pages/matchpage/Eventspage";

/** Scroll window to top whenever the route changes (fixes opening new page at footer) */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const Home = lazy(() => import("../modules/website/pages/Home/Home"));
const Members = lazy(() => import("../modules/website/pages/MembersPage/Members"));
const TalentedPlayers = lazy(() => import("../modules/website/pages/talentedplayers/TalentedPlayers"));
const Main = lazy(() => import("../modules/website/pages/BecomeAMember/Main"));
const ContactUs = lazy(() => import("../modules/website/pages/ContactUs/ContactUs"));
const BlogRoutes = lazy(() => import("../modules/website/pages/blog/MainBlogs"));
const AboutUs = lazy(() => import("../modules/website/pages/about/aboutus"));
const WebsiteLayout = lazy(() => import("../shared/layouts/WebsiteLayout"));
const CommitteePage = lazy(() => import("../modules/website/pages/committee/CommitteePage"));
const DonateNow = lazy(() => import("../modules/website/pages/donatenow/DonateNow"));
const TermsAndConditions = lazy(() => import("../modules/website/pages/termscondition/TermsAndConditions"));

/* When route/chunk is loading, show the same loader (rings, bars, logo) until data is ready */

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Preloader noTimer />}>
        <Routes>
          {/* WEBSITE */}
          <Route element={<WebsiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/members/special-members" element={<Members />} />
            <Route path="/members/general-members" element={<Members />} />
            <Route path="/members/special-members/:tab" element={<Members />} />
            <Route path="/talented-players" element={<TalentedPlayers />} />
            <Route path="/membership/individual-patron" element={<Main />} />
            <Route path="/membership/individual-player" element={<Main />} />
            <Route path="/membership/lifetime-corporate" element={<Main />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/blogs/*" element={<BlogRoutes />} />
            <Route path="/committee" element={<CommitteePage />} />
            <Route path="/donate-now" element={<DonateNow />} />
            <Route path="/events/:slug" element={<MatchDetailPage />} />
            <Route path="/events-list" element={<EventsPage />} />
            <Route path="/Contribute-now" element={<Navigate to="/donate-now" replace />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;