import { createRoot } from 'react-dom/client';
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import App from './App';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);