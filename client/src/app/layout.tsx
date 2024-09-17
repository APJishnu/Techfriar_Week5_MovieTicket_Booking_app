"use client"

import { usePathname } from 'next/navigation';
import UserNavbar from "@/components/Navbar/UserNavBar";
import AdminNavbar from "@/components/Navbar/AdminNavBar";
import "./globals.css";
import Footer from '@/components/Footer/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();


  // Determine if the user is on an admin route
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminRouteLogin = pathname.startsWith("/admin/admin-login");

  return (
    <html lang="en">
      <body>
        {/* Conditionally render the AdminNavbar if the route starts with "/admin" */}
        {isAdminRouteLogin ? null : isAdminRoute ? <AdminNavbar /> : <UserNavbar />}
        
        {children}
        {isAdminRoute ? null : <Footer />}
      </body>
    </html>
  );
}
