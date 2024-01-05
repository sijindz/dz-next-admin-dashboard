'use client';
import type { Metadata } from 'next'
import { Karla } from 'next/font/google'
import './globals.css'
import { useState } from 'react'
import { SideBar } from '@/components/sidebar';
import Header from '@/components/header';
import PageWrapper from '@/components/pagewrapper';

const karla = Karla({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ['latin'],
  variable: "--font-karla"
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [toggleCollapse, setToggleCollapse] = useState(false);

  return (
    <html lang="en">
      <body className={karla.className}>
        <div className='min-h-screen flex'>
          <SideBar toggleCollapse={toggleCollapse} setToggleCollapse={setToggleCollapse}></SideBar>
          <Header toggleCollapse={toggleCollapse} setToggleCollapse={setToggleCollapse}></Header>
          <PageWrapper children={children} toggleCollapse={toggleCollapse}></PageWrapper>
        </div>
      </body>
    </html>
  )
}
