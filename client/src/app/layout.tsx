"use client";

import { usePathname } from 'next/navigation';
import UserNavbar from "@/components/Navbar/UserNavBar";
import AdminNavbar from "@/components/Navbar/AdminNavBar";
import Footer from '@/components/Footer/Footer';
import GlobalLoader from '@/components/Loader/Loader';
import { useState, useEffect } from 'react';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading state to false after 2 seconds
    const timer = setTimeout(() => setLoading(false), 1000); // 2000ms = 2 seconds
    return () => clearTimeout(timer);
  }, []);

  // Determine if the user is on an admin route
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminRouteLogin = pathname.startsWith("/admin/admin-login");

  return (
    <html lang="en">
      <body>
      {loading ? <GlobalLoader /> : <>
        {/* Conditionally render the AdminNavbar if the route starts with "/admin" */}
        {isAdminRouteLogin ? null : isAdminRoute ? <AdminNavbar /> : <UserNavbar />}
       {children}
        {isAdminRoute ? null : <Footer />}
        </>}
      </body>
    </html>
  );
}
