module.exports = {
  siteMetadata: {
    title: "TheRoks",
    siteUrl: "https://theroks.com",
    twitterHandle: "@theroks",
    url: "https://theroks.com",
    description:
      "Thoughts on Microsoft .NET and related stuff",
    topics: [],
    menu: [
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Sitecore",
        path: "/tag/sitecore",
      },
    ],
    footerMenu: [
      {
        name: "Rss Feed",
        path: "https://feeds.feedburner.com/theroks",
      },
    ],
    search: true,
    author: {
      name: `Stefan`,
      description: `Hi! I'm Stefan, a software developer based in Utrecht, The Netherlands.`,
      social: {
        facebook: ``,
        twitter: `https://twitter.com/theroks`,
        linkedin: `https://www.linkedin.com/in/stefan-roks-82a3aa4/`,
        instagram: ``,
        youtube: ``,
        github: `https://github.com/theroks`,
        twitch: ``,
        stackoverflow: `https://stackoverflow.com/users/12258906/stefan-roks`,
        rss: `https://feeds.feedburner.com/theroks`,
      },
    },
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-20164906-1",
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://theroks.com',
        sitemap: 'https://theroks.com/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        exclude: ["/404/", "/archive", "/tags", "404.html", "/tag/*", "/dev-404-page/"],
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
          allSitePage.edges.map(edge => {
            return {
              url: site.siteMetadata.siteUrl + edge.node.path,
              changefreq: `daily`,
              priority: 0.7,
            }
          })
      }
    },    
    {
      resolve: `@nehalist/gatsby-theme-nehalem`,
      options: {
        contentPath: "./content",
        manifest: {
          name: `Stefan Roks's personal blog`,
          short_name: `theroks.com`,
          start_url: `/`,
          background_color: `#555555`,
          theme_color: `#555555`,
          display: `minimal-ui`,
          icon: `${__dirname}/content/assets/images/icon.png`,
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
              withWebp: true
            }
          }
        ]
      }
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
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.excerpt,
                  date: edge.node.frontmatter.created,
                  url: site.siteMetadata.siteUrl + edge.node.frontmatter.path + '?utm_source='+edge.node.frontmatter.title+'&utm_medium=RSS&&utm_campaign=RSS%20Feed',
                  guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
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
            title: `RSS Feed`
          }
        ]
      }
    },
  ],
};
