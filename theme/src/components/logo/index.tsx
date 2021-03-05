import React, { FunctionComponent } from "react"
import styled from "styled-components"
import { graphql, Link, useStaticQuery } from "gatsby"
import Theme from "../../styles/theme"
import { GatsbyImage } from "gatsby-plugin-image"

interface LogoProps {
  title: string
}

const LogoImage = styled(GatsbyImage)`
  max-height: 30px;
  width: 30px;
  margin-right: 45px;

  @media (max-width: ${Theme.breakpoints.sm}) {
    margin-right: 15px;
  }
`

const HomeLink = styled(Link)`
  align-self: center;
  height: 30px;
`

const Logo: FunctionComponent<LogoProps> = ({ title }) => {
  const logo = useStaticQuery(graphql`
    query {
      file(
        sourceInstanceName: { eq: "themeAssets" }
        name: { eq: "theroks-gatsby" }
      ) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 30, height: 30)
        }
      }
    }
  `)

  return (
    <HomeLink to={`/`}>
      <LogoImage
        image={logo.file.childImageSharp.gatsbyImageData}
        alt={title}
      />
    </HomeLink>
  )
}
export default Logo
