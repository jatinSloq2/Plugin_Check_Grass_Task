import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes";
import UnprotectedRoute from "./components/UnprotectedRoute";
import Home from "./pages/Home";
import WidgetPlugin from "./pages/WidgetPlugin";
import Login from "./pages/login";
import ShopifyPlugin from "./pages/ShopifyPlugin";
import ShopifySites from "./pages/ShopifySite";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <UnprotectedRoute>
            <Login />
          </UnprotectedRoute>
        }
      />

      <Route
        path="/widget-plugin"
        element={
          <ProtectedRoute>
            <WidgetPlugin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shopify-plugin"
        element={
          <ProtectedRoute>
            <ShopifyPlugin />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Home />} />
      <Route path="/shopify-site" element={<ShopifySites />} />
    </Routes>
  );
}

export default App;
