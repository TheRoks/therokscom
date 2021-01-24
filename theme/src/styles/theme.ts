import { DefaultTheme } from "./default-theme"

const colors = {
  primary: "#465775",
  secondary: "#C97064",
  tertiary: "#C4C8CC",
  link: "#D3D6D9",
  text: "#2D2D2D",
  background: "#fafafa",
}

const Theme: DefaultTheme = {
  layout: {
    backgroundColor: colors.background,
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    tertiaryColor: colors.tertiary,
    softDarkColor: "#2D2D2D",
    textColor: colors.text,
    linkColor: colors.link,
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
      `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, ` +
      `Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
  },
  fontSizes: [16, 24, 48, 64],
  components: {
    container: {
      width: `1260px`,
    },
    header: {
      height: `440px`,
      background: `linear-gradient(-45deg, #44596e, #a4cbb8) repeat scroll 0 0 transparent`,
    },
  },
}

export default Theme
