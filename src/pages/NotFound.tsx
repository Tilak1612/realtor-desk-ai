import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // 404 tracking could be sent to analytics service here
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold gradient-text">404</h1>
        <p className="mb-6 text-2xl text-muted-foreground">Oops! Page not found</p>
        <p className="mb-8 text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg" className="btn-gradient">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
