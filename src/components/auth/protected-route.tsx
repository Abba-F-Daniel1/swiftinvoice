import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0, 0.71, 0.2, 1.01]
            }}
          >
            <svg
              className="w-16 h-16 mx-auto mb-4"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-blue-500 dark:text-blue-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="20"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-purple-500 dark:text-purple-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.2
                }}
              />
            </svg>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Loading your experience
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Please wait while we verify your credentials
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}