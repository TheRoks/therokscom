module.exports = {
  siteMetadata: {
    title: "theroks.com",
    subtitle: "Thoughts on .NET Development",
    siteUrl: "https://theroks.com",
    twitterHandle: "@theroks",
    url: "https://theroks.com",
    description: "Thoughts on .NET Development",
    menu: [
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Sitecore",
        path: "/tag/sitecore",
      },
      {
        name: "About Me",
        path: "/about",
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
      resolve: `@theroks/gatsby-theme-blog`,
      options: {
        contentPath: "./content",
        assetsPath: `${__dirname}/assets`,
        manifest: {
          name: `Stefan Roks's personal blog`,
          short_name: `theroks.com`,
          start_url: `/`,
          background_color: `#465775`,
          theme_color: `#465775`,
          display: `minimal-ui`,
          icon: `${__dirname}/content/assets/images/icon.png`,
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-20164906-1",
      },
    },
    {
      resolve: "gatsby-plugin-preconnect",
      options: {
        domains: [
          {
            domain: "https://stats.g.doubleclick.net",
            crossOrigin: "anonymous",
          },
          {
            domain: "https://www.google-analytics.com",
            crossOrigin: "anonymous",
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://theroks.com",
        sitemap: "https://theroks.com/sitemap.xml",
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
  ],
}
