export interface DefaultTheme {
  layout: {
    backgroundColor: string
    primaryColor: string
    secondaryColor: string
    tertiaryColor: string
    softDarkColor: string
    linkColor: string
    textColor: string
  }
  fonts: {
    base: string
  }
  breakpoints: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  fontSizes: Array<number>
  components: {
    container: {
      width: string
    }
    header: {
      height: string
      background: string
    }
  }
}
