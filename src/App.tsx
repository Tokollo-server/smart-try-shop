import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CatalogWithSort from "./pages/CatalogWithSort";
import Product from "./pages/Product";
import AIBuilder from "./pages/AIBuilder";
import AIAssistant from "./pages/AIAssistant";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { SmartStylistChat } from "@/components/SmartStylistChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<CatalogWithSort />} />
          <Route path="/products" element={<CatalogWithSort />} />
          <Route path="/product/:handle" element={<Product />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/ai-builder" element={<AIBuilder />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <SmartStylistChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
