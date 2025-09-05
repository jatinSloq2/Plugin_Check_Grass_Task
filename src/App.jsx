import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import UnprotectedRoute from "./components/UnprotectedRoute";
import Home from "./pages/Home";
import Integrations from "./pages/Integrations";
import Calendly from "./pages/Integrations/Calendly";
import Shopify from "./pages/Integrations/shopify";
import WhatsAppLinkGenerator from "./pages/Integrations/WhatsAppLinkGenerator";
import WooCommerce from "./pages/Integrations/WooCommerce";
import Login from "./pages/Login";
import PayuIntegration from "./pages/payUintegrations";
import WatiAutomations from "./pages/WatiAutomation";
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
      <Route
        path="/integrations/calendly"
        element={<ProtectedRoute><Calendly /></ProtectedRoute>
        }
      />
      <Route
        path="/integrations/linkgenerator"
        element={<ProtectedRoute><WhatsAppLinkGenerator /></ProtectedRoute>
        }
      />
      <Route
        path="/integrations/widgetgenerator"
        element={<ProtectedRoute><WidgetPlugin /></ProtectedRoute>
        }
      />
      <Route path="/automations" element={<WatiAutomations />} />
    </Routes>

  );
}

export default App;
