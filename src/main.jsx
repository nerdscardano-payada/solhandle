import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import SolanaWalletProvider from '@/components/solhandle/SolanaWalletProvider'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <SolanaWalletProvider><App /></SolanaWalletProvider>
)