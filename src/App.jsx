import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CampaignHistory from "./pages/CampaignHistory";

/**
 * Application root - sets up routing and the persistent navigation bar.
 */
const App = () => (
  <>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<CampaignHistory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </>
);

export default App;
