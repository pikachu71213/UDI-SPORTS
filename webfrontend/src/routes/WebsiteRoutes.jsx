import { Routes, Route } from "react-router-dom";
import Home from "../modules/website/pages/Home/Home";
import WebsiteLayout from "../shared/layouts/WebsiteLayout";

const WebsiteRoutes = () => {
  return (
    <Routes>
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default WebsiteRoutes;