import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assuming App.jsx is in the same directory

// Find the root element in index.html
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render the App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);