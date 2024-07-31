/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./tpl/*.{html,js}"],

  theme: {
    container: {
      center: true,
    },

    extend: {
      preflight: true,

      colors: {
        guide__link: {
          color: "var(--guide__link-color)",
        },

        new_dentist: {
          404: "#f6f6f6",
        },

        luxuryBlue: {
          // 豪華頁 .0*

          100: "#61bec6", // 院長專長

          200: "#2e9dd7", // h2*
          300: "#009edd", // h4 內重點標*

          400: "#0068b7", // 地址 b*

          500: "#96ceeb", // 漢堡選單border*
        },

        luxuryGray: {
          // 豪華頁 .0*

          100: "#edf1f2", // 色塊*
          200: "#5f809a", // h3*
          300: "#6b7281", // 內文*
          400: "#8c8c8c", // li*
        },

        luxuryWhite: {
          // 豪華頁 .0*

          100: "#fefefe", // 診所名*
        },

        luxuryOrange: {
          // 豪華頁 .0*

          100: "#fbf4ed", // 心得卡片hover bg*

          200: "#f08163", // 心得卡片hover btn-bg*
        },

        luxuryYellow: {
          100: "#ffd000", // 網路評價星星 icon*
        },
      },

      spacing: {
        4.5: "1.125rem", // 18px

        5.5: "1.375rem", // 22px

        6.5: "1.625rem", // 26px

        7.5: "1.875rem", // 30px

        8.5: "2.125rem", // 34px

        9.5: "2.375rem", // 38px

        10.5: "2.625rem", // 42px

        11.5: "2.875rem", // 46px

        12.5: "3.125rem", // 50px

        13.5: "3.375rem", // 54px

        15: "3.75rem", // 60px

        15.5: "3.875rem", // 62px

        17: "4.25rem", // 68px

        17.5: "4.375rem", // 70px

        18: "4.5rem", // 72px

        22: "5.5rem", // 88px

        22.5: "5.625rem", // 90px

        34: "8.5rem", // 136p*

        35: "8.75rem", // 140p*
      },
    },

    fontFamily: {
      sans: [
        "Noto Sans TC",
        "Robot",
        "Segoe UI",
        "PingFang TC",
        "Heiti TC",
        "微軟正黑體",
        "Arial",
        "Helvetica",
        "sans-serif",
      ],
    },

    fontSize: {
      "2xs": ["0.625rem"], // 10px

      xs: ["0.75rem"], // 12px

      sm: ["0.875rem"], // 14px

      base: ["1rem"], // 16px

      lg: ["1.125rem"], // 18px

      xl: ["1.25rem"], // 20px

      "2xl": ["1.375rem"], // 22px

      "3xl": ["1.5rem"], // 24px

      "4xl": ["1.625rem"], // 26px

      "5xl": ["1.75rem"], // 28px

      "6xl": ["1.875rem"], // 30px

      "7xl": ["2rem"], // 32px

      "8xl": ["2.125rem"], // 34px

      "9xl": ["2.25rem"], // 36px

      "10xl": ["2.375rem"], // 38px

      "11xl": ["2.5rem"], // 40px

      "12xl": ["2.625rem"], // 42px

      "13xl": ["3.125rem"], // 50px

      "14xl": ["3.625rem"], // 58px
    },

    colors: {
      transparent: "transparent",

      current: "currentColor",

      white: "#FFFFFF",
    },
  },

  plugins: [],
};
