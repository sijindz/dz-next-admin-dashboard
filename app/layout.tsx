import { Karla } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata } from 'next';
import { THEME_ITEMS } from '@/constants/menu_constants';

const karla = Karla({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ['latin'],
  variable: "--font-karla"
})
export const metadata: Metadata = {
  title: "Dz LMS",
  description: "DZ Library management system created by Sijin Raj"
};

const themes = THEME_ITEMS.map(item => item.theme);
export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={karla.className + ' h-screen overflow-hidden'}>
        <ThemeProvider
          themes={themes}
          // themes={['dark', 'custom', 'light', 'dark-teal', 'black', 'dark-blue', 'sunlit', 'mint']}
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
