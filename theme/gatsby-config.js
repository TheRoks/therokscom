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
    flags: { PRESERVE_WEBPACK_CACHE: true },
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
      {
        resolve: 'gatsby-plugin-vercel-deploy',
        options: {
          headers: [{
            source: '/service-worker.js',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=0, must-revalidate',
              },
            ]
            },
            {
              source: '/(.*)',
              headers: [
                {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
                },
                {
                  key: 'X-Frame-Options',
                  value: 'DENY',
                },
                {
                  key: 'X-XSS-Protection',
                  value: '1; mode=block',
                },
              ],
            },
          ],
        },
      },
      {
        resolve: `gatsby-plugin-offline`,
        options: {
          workboxConfig: {
            runtimeCaching: [
              {
                // Use cacheFirst since these don't need to be revalidated (same RegExp
                // and same reason as above)
                urlPattern: /(\.js$|\.css$|static\/)/,
                handler: `CacheFirst`,
              },
              {
                // page-data.json files, static query results and app-data.json
                // are not content hashed
                urlPattern: /^https?:.*\/page-data\/.*\.json/,
                handler: `NetworkFirst`,
              },
              {
                // Add runtime caching of various other page resources
                urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
                handler: `StaleWhileRevalidate`,
              },
              {
                // Google Fonts CSS (doesn't end in .css so we need to specify it)
                urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
                handler: `StaleWhileRevalidate`,
              },
            ],
          },
        },
      },
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
          output: `/`,
          excludes: [
            "/404/",
            "/archive",
            "/tags",
            "404.html",
            "/tag/*",
            "/dev-404-page/",
          ],
          query: `
            {
              site {
                siteMetadata {
                  siteUrl
                }
              }
              allSitePage: allMarkdownRemark {
              nodes: edges {
                node {
                  frontmatter {
                    modifiedGmt: updated
                    path
                  }
                }
              }
            }
          }`,
          resolveSiteUrl: ({ site: { siteMetadata } }) => siteMetadata.siteUrl,
          resolvePages: ({ allSitePage: { nodes: allPages } }) => {
            return allPages.map((node) => {
              const frontmatter = node.node.frontmatter
              return { ...frontmatter }
            })
          },
          filterPages: () => {
            return false
          },
          serialize: ({ path, modifiedGmt }) => {
            return {
              url: path,
              changefreq: `daily`,
              priority: 0.7,
              lastmod: modifiedGmt,
            }
          },
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
