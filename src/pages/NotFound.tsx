import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container flex flex-1 items-center justify-center py-24">
        <div className="text-center">
          <p className="eyebrow mb-4">Error 404</p>
          <h1 className="font-bold tracking-tight text-6xl md:text-8xl">Page not found</h1>
          <p className="mx-auto mt-6 max-w-md text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="mt-10 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Back to homepage
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
