import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProvider } from "./contexts/AppContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
// Реєстрація Service Worker
// Service Worker тимчасово вимкнено через проблеми з кешем.
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/sw.js')
//       .then((registration) => {
//         console.log('Service Worker зареєстрований:', registration.scope);
//       })
//       .catch((error) => {
//         console.log('Помилка реєстрації Service Worker:', error);
//       });
//   });
// }
