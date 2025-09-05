import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import UnprotectedRoute from "./components/UnprotectedRoute";
import CalendlyIntegration from "./pages/CalendlyIntegration";
import Home from "./pages/Home";
import Integrations from "./pages/Integrations";
import Shopify from "./pages/Integrations/shopify";
import WooCommerce from "./pages/Integrations/WooCommerce";
import Login from "./pages/Login";
import PayuIntegration from "./pages/payUintegrations";
import WatiAutomations from "./pages/WatiAutomation";
import WhatsAppLinkGenerator from "./pages/WhatsAppLinkGenerator";
import WhatsAppShop from "./pages/whatsAppShop";
import WidgetPlugin from "./pages/WidgetPlugin";

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
        path="/calendly"
        element={<ProtectedRoute><CalendlyIntegration /></ProtectedRoute>
        }
      />
      <Route
        path="/payu"
        element={<ProtectedRoute><PayuIntegration /></ProtectedRoute>
        }
      />
      <Route
        path="/integrations"
        element={<ProtectedRoute><Integrations /></ProtectedRoute>
        }
      />
      <Route
        path="/integrations/shopify"
        element={<ProtectedRoute><Shopify /></ProtectedRoute>
        }
      />
      <Route
        path="/integrations/woocommerce"
        element={<ProtectedRoute><WooCommerce /></ProtectedRoute>
        }
      />
      <Route path="/shop/:id" element={<WhatsAppShop />} />
      <Route path="/linkgenerator" element={<WhatsAppLinkGenerator />} />
      <Route path="/automations" element={<WatiAutomations />} />
    </Routes>

  );
}

export default App;
