import styled from "styled-components"
import theme from "../../styles/theme"

export const StyledHeader = styled.header`
  display: flex;
  background: ${theme.layout.primaryColor};
  flex-direction: column;
  height: 300px;

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 25vh;
  }

  @media (max-width: ${theme.breakpoints.xs}) {
    height: 35vh;
  }
`

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-top: -10px;
    font-size: 0.75em;
    margin-left: 10px;
    margin-right: 10px;
    text-align: center;
  }
`

export const Title = styled.h1`
  display: block;
  font-size: ${theme.fontSizes[3]}px;
  text-shadow: 0 5px 18px rgba(0, 0, 0, 0.57);

  color: ${theme.layout.tertiaryColor};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 10vmin;
  }
`

export const Description = styled.h2`
  margin: 0;
  opacity: 0.85;
  color: ${theme.layout.tertiaryColor};
`
