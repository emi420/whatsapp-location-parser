import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { IntlProvider } from 'react-intl';
import En from './int/en.json';
import Es from './int/es.json';

const locales = {
  "en": En,
  "es": Es
}

const getLocaleMessages = () => {
  if (navigator.language in locales) {
    return locales[navigator.language];
  }
  return locales["en"]
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <IntlProvider locale ={navigator.language} messages={getLocaleMessages()}>
    <App />
    </IntlProvider>
  </React.StrictMode>
);


