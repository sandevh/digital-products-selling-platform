import "./globals.css";

export const metadata = {
  title: "DigitalProductsSellingPlatform",
  description: "Digital Products Selling Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
