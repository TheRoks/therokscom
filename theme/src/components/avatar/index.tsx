import React, { CSSProperties, FunctionComponent } from "react"
import styled from "styled-components"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

interface AvatarProps {
  alt: string
  style?: CSSProperties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fixed: any
}

const StyledAvatar = styled(GatsbyImage)<AvatarProps>`
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
          gatsbyImageData(layout: FIXED, width: 55, height: 55)
        }
      }
      siteProfile: file(
        sourceInstanceName: { eq: "siteAssets" }
        name: { eq: "profile" }
      ) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 55, height: 55)
        }
      }
    }
  `)

  return (
    <StyledAvatar
      image={
        logo.siteProfile
          ? logo.siteProfile.childImageSharp.gatsbyImageData
          : logo.themeProfile.childImageSharp.gatsbyImageData
      }
      alt={alt}
      style={style}
    />
  )
}

export default Avatar
