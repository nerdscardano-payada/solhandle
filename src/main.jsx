import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { ThemeProvider } from 'next-themes'
import SolanaWalletProvider from '@/components/solhandle/SolanaWalletProvider'
import '@solana/wallet-adapter-react-ui/styles.css'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme disableTransitionOnChange>
    <SolanaWalletProvider><App /></SolanaWalletProvider>
  </ThemeProvider>
)