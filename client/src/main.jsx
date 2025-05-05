
(() => {

  const suppressedWarns = [
    'React does not recognize the `navbarOffsetBreakpoint`',
    'React Router Future Flag Warning',
  ];

  const suppressedErrors = [
    'Error fetching quote',
    'net::ERR_NAME_NOT_RESOLVED',
    '502 (Bad Gateway)',
    'ERR_CERT_DATE_INVALID',
  ];


  const rawWarn = console.warn.bind(console);
  const rawError = console.error.bind(console);

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      suppressedWarns.some((kw) => args[0].includes(kw))
    ) {
      return; // 吞掉匹配的 warning
    }
    rawWarn(...args);
  };

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      suppressedErrors.some((kw) => args[0].includes(kw))
    ) {
      return; 
    }
    rawError(...args);
  };
})();

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// 渲染 React 应用
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
