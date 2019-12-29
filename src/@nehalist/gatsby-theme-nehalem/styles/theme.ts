const fontSizes = [16, 24, 48, 64];

const colors = {
  primary: "#9e9e9e", 
  secondary: "#707070",
  secondaryDarker: "#000000",
  smokyBlack: "#000000",
  snow: "#fafafa",
  black09: "rgba(25, 10, 0, 0.9)",
  black07: "rgba(25, 10, 0, 0.7)",
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
      `Montserrat, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, ` +
      `Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
  },
  components: {
    container: {
      width: `1260px`,
    },
  },
};

export default theme;
