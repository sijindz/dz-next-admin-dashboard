import { Karla } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata } from 'next';

const karla = Karla({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ['latin'],
  variable: "--font-karla"
})
export const metadata: Metadata = {
  title: "Dz admin dashboard",
  description: "NextJs admin dashboard created by Sijin Raj"
};

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={karla.className + ' h-screen overflow-hidden'}>
        <ThemeProvider
          themes={['dark', 'custom', 'light']}
          attribute="class"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
