import './tailwind.css';
import './index.css';
import './App.css';
import { ThemeProvider } from '@/context/ThemeContext';
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate';

export const metadata = {
  title: 'Prima Integrasi Network',
  description: 'Enterprise integration solutions for the modern enterprise.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ScrollToTopOnNavigate />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
