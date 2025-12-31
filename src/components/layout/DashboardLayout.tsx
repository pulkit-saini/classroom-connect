import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'teacher' | 'student')[];
}

export function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const { token, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to the user's appropriate dashboard
    return <Navigate to={`/${role}`} replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-14 items-center gap-4 border-b border-border/50 px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="-ml-2" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
