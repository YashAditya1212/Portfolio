import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// StrictMode intentionally double-invokes effects in dev to catch side effects.
// This is incompatible with Three.js WebGL contexts which cannot be safely
// disposed and recreated on the same canvas element mid-frame.
// For a portfolio site there is no benefit to StrictMode — removing it.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
