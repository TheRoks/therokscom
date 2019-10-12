module.exports = {
  siteMetadata: {
    title: "TheRoks",
    siteUrl: "https://theroks.com",
    twitterHandle: "@theroks",
    url: "https://theroks.com",
    description:
      "Thoughts on .NET and related stuff",
    topics: [],
    menu: [
      {
        name: "Home",
        path: "/",
      },
    ],
    footerMenu: [
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
        rss: `https://feeds.feedburner.com/theroks`
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
  ],
};
