"use client"

// app/layout.tsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { StyledRoot } from '@/styles/StyleRoot';
import * as React from 'react';
import { Inter } from 'next/font/google'
import CssBaseline from '@mui/material/CssBaseline';
import Box from "@mui/material/Box"
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import ResponsiveAppBar from './ui/dashboard/../AppBar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

//main layout of the all the webapp
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const defaultTheme = createTheme();
  return (
    <React.Fragment >
      <CssBaseline />
        <html lang="en">
          <body className={inter.className}>
            <AppRouterCacheProvider>
              <StyledRoot>
                <ThemeProvider theme={defaultTheme}>
                  <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <ResponsiveAppBar />
                    <React.Suspense>
                      {children}
                    </React.Suspense>
                  </Box>
                </ThemeProvider>
              </StyledRoot>
            </AppRouterCacheProvider>
          </body>
        </html>
    </React.Fragment>
  );
}
