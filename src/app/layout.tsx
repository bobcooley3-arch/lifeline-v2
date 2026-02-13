import "./globals.css";

export const metadata = {
  title: "Lifeline Safety",
  description: "Monitoring System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#020617', color: 'white' }}>
        {children}
      </body>
    </html>
  );
}
