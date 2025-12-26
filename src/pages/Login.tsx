import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("google_access_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      localStorage.setItem("google_access_token", tokenResponse.access_token);
      navigate("/dashboard");
    },
    onError: (errorResponse) => {
      toast.error(errorResponse.error_description ?? errorResponse.error ?? "Google sign-in failed");
      console.error("Login Failed:", errorResponse);
    },
    onNonOAuthError: (nonOAuthError) => {
      toast.error("Login popup was blocked/closed. Please try again.");
      console.error("Login Non-OAuth Error:", nonOAuthError);
    },
    prompt: "consent",
    include_granted_scopes: true,
    scope:
      "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.announcements.readonly https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly https://www.googleapis.com/auth/classroom.rosters.readonly",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/50 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-8 backdrop-blur-sm">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-glow">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Classroom Portal
            </h1>
            <p className="text-muted-foreground text-sm">
              Connect with Google Classroom to access your courses
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span>View your enrolled courses</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <span>Access your coursework and assignments</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button
            onClick={() => login()}
            className="w-full h-12 bg-card hover:bg-secondary border border-border text-foreground font-medium rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-6">
            By signing in, you agree to grant access to your Google Classroom
            data
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
