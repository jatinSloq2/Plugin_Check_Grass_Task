import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes";
import UnprotectedRoute from "./components/UnprotectedRoute";
import WidgetPlugin from "./pages/WidgetPlugin";
import Login from "./pages/login";
import Home from "./pages/Home";
import Check from "./pages/check";
import ShopifyPlugin from "./pages/ShopifyPlugin";

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
      <Route path="/check" element={<Check />} />
    </Routes>
  );
}

export default App;
