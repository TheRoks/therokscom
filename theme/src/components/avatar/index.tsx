import React, { CSSProperties, FunctionComponent } from "react"
import styled from "styled-components"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

interface AvatarProps {
  alt: string
  style?: CSSProperties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fixed: any
}

const StyledAvatar = styled(Img)<AvatarProps>`
  max-width: 55px;
  border-radius: 100%;
`

/**
 * Placeholder component which shows your avatar.
 */
const Avatar: FunctionComponent<AvatarProps> = ({ alt, style }) => {
  const logo = useStaticQuery(graphql`
    query {
      themeProfile: file(
        sourceInstanceName: { eq: "themeAssets" }
        name: { eq: "profile" }
      ) {
        childImageSharp {
          fixed(width: 55, height: 55) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      siteProfile: file(
        sourceInstanceName: { eq: "siteAssets" }
        name: { eq: "profile" }
      ) {
        childImageSharp {
          fixed(width: 55, height: 55) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <StyledAvatar
      fixed={
        logo.siteProfile
          ? logo.siteProfile.childImageSharp.fixed
          : logo.themeProfile.childImageSharp.fixed
      }
      alt={alt}
      style={style}
    />
  )
}

export default Avatar
