/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. 브랜드 및 주요 텍스트 컬러 
      colors: {
        brand: {
          main: "var(--brand-main)",
          dark: "var(--brand-dark)",
        },
        font: {
          main: "var(--font-main)",
          secondary: "var(--font-main-second)",
          white: "var(--font-second)", 
          gray: "var(--font-third)", 
          "gray-dark": "var(--font-third-second)", 
        },
        writer: "var(--writer-color)",
        card: {
          top: "var(--card-top)",
        },
        notification: {
          clicked: "var(--notification-clicked)",
          border: "var(--notification-border)",
        },
        store: {
          border: "var(--store-border)",
          soldout: "var(--store-sold-out)",
        },
        nav: {
          unclicked: "var(--nav-unclicked)",
          clicked: "var(--nav-clicked)",
        },
        alarm: {
          main: "var(--alarm-main)",
          second: "var(--alarm-second)",
        },
        subscribe: "var(--subscribe-color)",
        unsubscribe: "var(--unsubscribe-color)",
      },
      // 2. 그라데이션
      backgroundImage: {
        "grad-bg": "var(--grad-bg)",
        "grad-item": "var(--grad-item)",
        "grad-notification": "var(--grad-notification)",
        "grad-button": "var(--grad-button)",
        "grad-store": "var(--grad-store)",
        "grad-profile": "var(--grad-profile)",
        "grad-accent": "var(--grad-accent)",
      },
      // 3. 모양 및 그림자 
      borderRadius: {
        main: "var(--radius-main)",    // 32px
        button: "var(--radius-button)", // 16px
      },
      boxShadow: {
        main: "var(--main-shadow)",
        card: "var(--card-shadow)",
        top: "var(--top-shadow)",
      },
    },
  },
  plugins: [],
};