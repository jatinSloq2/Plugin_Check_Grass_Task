import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import UnprotectedRoute from "./components/UnprotectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ShopifyPlugin from "./pages/ShopifyPlugin";
import ShopifySites from "./pages/ShopifySite";
import WidgetPlugin from "./pages/WidgetPlugin";
import WhatsAppShop from "./pages/whatsAppShop";
import WooShopIntegration from "./pages/WooCommerceAddForm";
import WooNotificationSettings from "./pages/WooNotificationSettings";
import WhatsAppLinkGenerator from "./pages/WhatsAppLinkGenerator";
import CalendlyIntegration from "./pages/CalendlyIntegration";

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
      <Route
        path="/woo-plugin"
        element={<ProtectedRoute><WooShopIntegration /></ProtectedRoute>
        }
      />
      <Route
        path="/woo-settings"
        element={<ProtectedRoute><WooNotificationSettings /></ProtectedRoute>
        }
      />
      <Route
        path="/calendly"
        element={<ProtectedRoute><CalendlyIntegration /></ProtectedRoute>
        }
      />
     <Route path="/shop/:id" element={<WhatsAppShop />} />
     <Route path="/linkgenerator" element={<WhatsAppLinkGenerator />} />
    </Routes>

  );
}

export default App;
