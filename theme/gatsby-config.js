module.exports = (themeOptions) => {
  const loadDefaultPages =
    themeOptions.loadDefaultPages !== undefined
      ? themeOptions.loadDefaultPages
      : true
  const contentPath = themeOptions.contentPath || "content"
  const manifest = themeOptions.manifest
    ? themeOptions.manifest
    : {
        name: `theroks - A Gatsby theme`,
        short_name: `theroks`,
        start_url: `/`,
        background_color: `#465775`,
        theme_color: `#465775`,
        display: `minimal-ui`,
        icon: `${__dirname}/assets/theroks-gatsby.png`,
      }
  const assetsPath = themeOptions.assetsPath || `${__dirname}/assets`
  const rssFeed = themeOptions.rssFeed || {
    title: `Rss Feed`,
  }

  return {
    siteMetadata: {
      title: `theroks`,
      subtitle: `Personal blog`,
      siteUrl: `https://theroks.com`,
      description: `A Gatsby theme for everyone`,
      menu: [
        {
          name: "Home",
          path: "/",
        },
        {
          name: "Example",
          path: "/page",
        },
      ],
      footerMenu: [
        {
          name: "RSS",
          path: "/rss.xml",
        },
        {
          name: "Sitemap",
          path: "/sitemap.xml",
        },
      ],
      search: true,
      author: {
        name: `theroks`,
        description: `I'm <strong>theroks</strong>, a Gatsby theme by
        <a href="https://theroks.com" rel="noopener" target="_blank">theroks.com</a>. If you like what you see feel free to give a
        <a href="https://github.com/theroks/therokscom" rel="noopener" target="_blank">star on GitHub!</a>`,
        social: {
          facebook: ``,
          twitter: `https://twitter.com/theroks`,
          linkedin: `https://www.linkedin.com/in/stefan-roks`,
          instagram: ``,
          youtube: ``,
          github: `https://github.com/theroks`,
          twitch: ``,
        },
        profile: `${__dirname}/assets/theroks-gatsby.png`,
      },
    },
    plugins: [
      `gatsby-plugin-typescript`,
      `gatsby-transformer-sharp`,
      `gatsby-plugin-react-helmet`,
      `gatsby-plugin-styled-components`,
      `gatsby-plugin-image`,
      `gatsby-plugin-sharp`,
      {
        resolve: `gatsby-plugin-manifest`,
        options: manifest,
      },
      `gatsby-plugin-offline`,
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: "content",
          path: contentPath,
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `siteAssets`,
          path: assetsPath,
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `themeAssets`,
          path: `${__dirname}/assets`,
        },
      },
      {
        resolve: `gatsby-transformer-yaml`,
        options: {
          typeName: `Tags`,
        },
      },
      {
        resolve: `gatsby-plugin-sitemap`,
        options: {
          output: `/sitemap.xml`,
          exclude: [
            "/404/",
            "/archive",
            "/tags",
            "404.html",
            "/tag/*",
            "/dev-404-page/",
          ],
          // Exclude specific pages or groups of pages using glob parameters
          // See: https://github.com/isaacs/minimatch
          // The example below will exclude the single `path/to/page` and all routes beginning with `category`
          query: `
            {
              site {
                siteMetadata {
                  siteUrl
                }
              }

              allSitePage {
                edges {
                  node {
                    path
                  }
                }
              }
          }`,
          serialize: ({ site, allSitePage }) =>
            allSitePage.edges.map((edge) => {
              return {
                url: site.siteMetadata.siteUrl + edge.node.path,
                changefreq: `daily`,
                priority: 0.7,
              }
            }),
        },
      },
      {
        resolve: `gatsby-plugin-lunr`,
        options: {
          languages: [
            {
              name: "en",
            },
          ],
          fields: [
            { name: "title", store: true, attributes: { boost: 20 } },
            { name: "content", store: true },
            { name: "tags", store: true },
            { name: "excerpt", store: true },
            { name: "path", store: true },
          ],
          resolvers: {
            MarkdownRemark: {
              title: (node) => node.frontmatter.title,
              content: (node) => node.html,
              tags: (node) => node.frontmatter.tags,
              excerpt: (node) => node.frontmatter.excerpt,
              path: (node) => node.frontmatter.path,
            },
          },
        },
      },
      {
        resolve: `gatsby-transformer-remark`,
        options: {
          plugins: [
            `gatsby-remark-autolink-headers`,
            `gatsby-remark-prismjs`,
            {
              resolve: `gatsby-remark-images`,
              options: {
                maxWidth: 1200,
                withWebp: true,
              },
            },
            {
              resolve: "gatsby-remark-external-links",
              options: {
                target: "_blank",
                rel: "nofollow noopener",
              },
            },
            `gatsby-remark-static-images`,
          ],
        },
      },
      loadDefaultPages && {
        resolve: `gatsby-plugin-page-creator`,
        options: {
          path: `${__dirname}/src/pages`,
        },
      },
      {
        resolve: `gatsby-plugin-feed`,
        options: {
          query: `
            {
              site {
                siteMetadata {
                  title
                  description
                  siteUrl
                  site_url: siteUrl
                }
              }
            }
          `,
          feeds: [
            {
              serialize: ({ query: { site, allMarkdownRemark } }) => {
                return allMarkdownRemark.edges.map((edge) => {
                  return Object.assign({}, edge.node.frontmatter, {
                    description: edge.node.frontmatter.excerpt,
                    date: edge.node.frontmatter.created,
                    url:
                      site.siteMetadata.siteUrl +
                      edge.node.frontmatter.path +
                      "?utm_source=" +
                      edge.node.frontmatter.title +
                      "&utm_medium=RSS&&utm_campaign=RSS%20Feed",
                    guid:
                      site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                    custom_elements: [{ "content:encoded": edge.node.html }],
                  })
                })
              },
              query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___created] },
                  filter: { fileAbsolutePath: { regex: "/(posts)/.*\\\\.md$/" } }
                ) {
                  edges {
                    node {
                      html
                      frontmatter {
                        title
                        excerpt
                        path
                        created
                      }
                    }
                  }
                }
              }
              `,
              output: `/rss.xml`,
              title: rssFeed.title,
            },
          ],
        },
      },
    ].filter(Boolean),
  }
}
