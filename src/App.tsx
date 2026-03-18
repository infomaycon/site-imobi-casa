import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import DemoSite from "./pages/DemoSite.tsx";
import Login from "./pages/Login.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AddProperty from "./pages/admin/AddProperty.tsx";
import PropertyList from "./pages/admin/PropertyList.tsx";
import AppearancePage from "./pages/admin/AppearancePage.tsx";
import SiteContentPage from "./pages/admin/SiteContentPage.tsx";
import LeadsPage from "./pages/admin/LeadsPage.tsx";
import SettingsPage from "./pages/admin/SettingsPage.tsx";
import AccountPage from "./pages/admin/AccountPage.tsx";
import HelpPage from "./pages/admin/HelpPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo/:modelId" element={<DemoSite />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AddProperty />} />
              <Route path="properties" element={<PropertyList />} />
              <Route path="appearance" element={<AppearancePage />} />
              <Route path="content" element={<SiteContentPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
