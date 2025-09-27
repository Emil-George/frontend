import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated && user) {
      const homePath = user.role === 'ADMIN' ? '/admin' : '/tenant';
      navigate(homePath);
    } else {
      navigate('/login');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">NBJ Group</h1>
        </div>

        <Card className="shadow-lg text-center">
          <CardHeader className="space-y-4">
            <div className="text-6xl font-bold text-primary">404</div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription className="text-base">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleGoHome} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
              
              <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>

            {!isAuthenticated && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  Need to access your account?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
