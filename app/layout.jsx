import "./globals.css";

export const metadata = {
  title: "Jeremy Airlines",
  description: "Booking system for fictional airline",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}