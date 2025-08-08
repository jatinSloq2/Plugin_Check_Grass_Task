import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import UnprotectedRoute from "./components/UnprotectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ShopifyPlugin from "./pages/ShopifyPlugin";
import ShopifySites from "./pages/ShopifySite";
import WidgetPlugin from "./pages/WidgetPlugin";
import WhatsAppShop from "./pages/whatsAppShop";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<UnprotectedRoute><Login /></UnprotectedRoute>}
      />

      <Route
        path="/"
        element={<ProtectedRoute><Home /></ProtectedRoute>
        }
      />

      <Route
        path="/widget-plugin"
        element={<ProtectedRoute><WidgetPlugin /></ProtectedRoute>
        }
      />

      <Route
        path="/shopify-plugin"
        element={<ProtectedRoute><ShopifyPlugin /></ProtectedRoute>
        }
      />

      <Route
        path="/shopify-site"
        element={<ProtectedRoute><ShopifySites /></ProtectedRoute>
        }
      />
     <Route path="/shop/:id" element={<WhatsAppShop />} />
    </Routes>

  );
}

export default App;
