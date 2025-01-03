'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children, path, isAuthenticated }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(path);
    }
  }, [isAuthenticated, path, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
