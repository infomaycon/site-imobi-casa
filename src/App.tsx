import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

const Index = lazy(() => import("./pages/Index.tsx"));
const UnderConstruction = lazy(() => import("./pages/UnderConstruction.tsx"));
const DemoSite = lazy(() => import("./pages/DemoSite.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const SuperAdminLogin = lazy(() => import("./pages/SuperAdminLogin.tsx"));
const TestLogin = lazy(() => import("./pages/TestLogin.tsx"));
const TestSignup = lazy(() => import("./pages/TestSignup.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const SuperAdminForgotPassword = lazy(() => import("./pages/SuperAdminForgotPassword.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AddProperty = lazy(() => import("./pages/admin/AddProperty.tsx"));
const PropertyList = lazy(() => import("./pages/admin/PropertyList.tsx"));
const AppearancePage = lazy(() => import("./pages/admin/AppearancePage.tsx"));
const SiteContentPage = lazy(() => import("./pages/admin/SiteContentPage.tsx"));
const LeadsPage = lazy(() => import("./pages/admin/LeadsPage.tsx"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage.tsx"));
const AccountPage = lazy(() => import("./pages/admin/AccountPage.tsx"));
const HelpPage = lazy(() => import("./pages/admin/HelpPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const SuperAdminLayout = lazy(() => import("./pages/super-admin/SuperAdminLayout.tsx"));
const DashboardPage = lazy(() => import("./pages/super-admin/DashboardPage.tsx"));
const SubscribersPage = lazy(() => import("./pages/super-admin/SubscribersPage.tsx"));
const UsersPage = lazy(() => import("./pages/super-admin/UsersPage.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/em-construcao" element={<UnderConstruction />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />
            <Route path="/super-admin-forgot-password" element={<SuperAdminForgotPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/demo/:modelId" element={<DemoSite />} />
            <Route path="/test-login" element={<TestLogin />} />
            <Route path="/test-signup" element={<TestSignup />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AddProperty />} />
              <Route path="properties" element={<PropertyList />} />
              <Route path="appearance" element={<AppearancePage />} />
              <Route path="content" element={<SiteContentPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="help" element={<HelpPage />} />
            </Route>
            <Route path="/super-admin" element={<SuperAdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="subscribers" element={<SubscribersPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
