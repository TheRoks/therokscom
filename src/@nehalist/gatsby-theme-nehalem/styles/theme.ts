const fontSizes = [16, 24, 48, 64];

const colors = {
  primary: "#37a7c4", // deep lemon
  secondary: "#555555", // illuminating emerald
  secondaryDarker: "#197559",
  smokyBlack: "#090707", // smoky black
  snow: "#F7F7F7", // snow
  black09: "rgba(25, 10, 0, 0.9)",
  shadow: "rgba(0, 0, 0, 0.09)",
};

export const theme = {
  fontSizes,
  colors,
  layout: {
    backgroundColor: colors.snow,
    primaryColor: colors.primary,
    linkColor: colors.secondary,
  },
  breakpoints: {
    xs: `425px`,
    sm: `576px`,
    md: `768px`,
    lg: `992px`,
    xl: `1300px`,
  },
  fonts: {
    base:
      `system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, ` +
      `Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
  },
  components: {
    container: {
      width: `1260px`,
    },
  },
};

export default theme;
