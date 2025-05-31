import React from 'react';
import ReactDOM from 'react-dom/client'; // Using React 18 createRoot API
import App from './App';

// If you want to add global styles via a CSS file instead of <style> in index.html:
// 1. Create src/index.css
// 2. Put your global styles there
// 3. Uncomment the line below:
// import './index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
