import React, { FunctionComponent } from "react"
import Layout from "@theroks/gatsby-theme-blog/src/components/layout"
import SEO from "@theroks/gatsby-theme-blog/src/components/seo"
import { Container } from "@theroks/gatsby-theme-blog/src/components/common"
import PageSidebarContent from "@theroks/gatsby-theme-blog/src/components/page-sidebar-content"
import Subheader from "@theroks/gatsby-theme-blog/src/components/subheader"
import styled from "styled-components"
import Theme from "@theroks/gatsby-theme-blog/src/styles/theme"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

interface AboutProps {
  location: Location
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CertificationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fixed: any
}

const AboutMe = styled.div`
  width: 100%;
  display: flex;
  /* justify-content: center; */
  padding: 20px;
  padding-bottom: 60px;
  @media (max-width: ${Theme.breakpoints.xl}) {
    padding-left: 21px;
  }
  align-items: baseline;
`

const PageContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  @media (max-width: ${Theme.breakpoints.md}) {
    display: block;
  }
  p:first-child {
    margin-top: 0;
  }
  li > a,
  p > a {
    color: ${Theme.layout.linkColor};
    border-bottom: 2px ${Theme.layout.linkColor} solid;
  }
`

const PageSidebar = styled.aside`
  margin-left: 50px;
  @media (max-width: ${Theme.breakpoints.md}) {
    margin-left: 0;
  }
`

interface Result {
  administrator: Logo
  developer: Logo
  architect: Logo
}

interface Logo {
  childImageSharp: ChildImageSharp
}

interface ChildImageSharp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gatsbyImageData: any
}

const cerification = graphql`
  query {
    administrator: file(
      sourceInstanceName: { eq: "siteAssets" }
      name: { eq: "microsoft-certified-azure-administrator-associate" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED, width: 100, height: 100)
      }
    }
    developer: file(
      sourceInstanceName: { eq: "siteAssets" }
      name: { eq: "microsoft-certified-azure-developer-associate" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED, width: 100, height: 100)
      }
    }
    architect: file(
      sourceInstanceName: { eq: "siteAssets" }
      name: { eq: "microsoft-certified-azure-solutions-architect-expert" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED, width: 100, height: 100)
      }
    }
  }
`

interface LogoProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any
}

const StyledLogo = styled(GatsbyImage)<LogoProps>``

const AboutPage: FunctionComponent<AboutProps> = ({ location }) => {
  const certifications = useStaticQuery<Result>(cerification)
  return (
    <Layout bigHeader={false}>
      <SEO
        location={location}
        title={`About me`}
        description={`Stefan Roks's personal blog on .NET Development.`}
      />
      <Subheader title={`About Me`} />
      <PageContainer>
        <AboutMe>
          <div style={{ paddingLeft: "15px" }}>
            <h2>
              Hi! I&apos;m Stefan Roks{" "}
              <span role="img" aria-label="Welcome">
                👋
              </span>
            </h2>
            <ul style={{ listStyleType: "none", padding: 0, marginBottom: 0 }}>
              <li>
                <span role="img" aria-label="My Location">
                  🏡
                </span>{" "}
                I live in Utrecht, The Netherlands.{" "}
              </li>
              <li>
                <span role="img" aria-label="My Study">
                  🎓
                </span>{" "}
                I have a bachelor degree in Computer Science.{" "}
              </li>
              <li>
                <span role="img" aria-label="My Work">
                  👩🏻‍💻
                </span>{" "}
                I&apos;ve been working as a .NET Developer and Sitecore
                developer.
              </li>
              <li>
                <span role="img" aria-label="My Working position">
                  👩🏻‍💻
                </span>{" "}
                Currently working as a Sitecore lead at Centraal Beheer.
              </li>
            </ul>
            <h3>
              <span role="img" aria-label="My Certifications">
                📜
              </span>
              Certifications
            </h3>
            <a
              target="_blank"
              href="https://www.youracclaim.com/badges/72a91d44-74ec-4cbd-a746-12bf5ee239db"
              rel="noreferrer noopener"
            >
              <StyledLogo
                alt="Certificate"
                image={
                  certifications.administrator.childImageSharp.gatsbyImageData
                }
              />
            </a>
            <a
              target="_blank"
              href="https://www.youracclaim.com/badges/196583ce-0a4c-4008-99f4-2c0d919075c0"
              rel="noreferrer noopener"
            >
              <StyledLogo
                alt="Certificate"
                image={certifications.developer.childImageSharp.gatsbyImageData}
              />
            </a>
            <a
              target="_blank"
              href="https://www.youracclaim.com/badges/027a877a-aea4-4067-a636-abeecae71b50"
              rel="noreferrer noopener"
            >
              <StyledLogo
                alt="Certificate"
                image={certifications.architect.childImageSharp.gatsbyImageData}
              />
            </a>
          </div>
        </AboutMe>
        <PageSidebar>
          <PageSidebarContent />
        </PageSidebar>
      </PageContainer>
    </Layout>
  )
}

export default AboutPage
