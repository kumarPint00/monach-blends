import "./globals.css";

export const metadata = {
  title: "Monarch Blends",
  description:
    "Monarch Blends — premium tobacco, North American formula, made in India by Shree Siddheshwari Enterprise Pvt. Ltd.",
  openGraph: {
    title: "Monarch Blends",
    description: "Premium tobacco. North American formula. Made in India.",
    type: "website"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060606"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
