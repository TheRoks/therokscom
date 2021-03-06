export interface SiteMetadata {
  site: {
    siteMetadata: {
      title: string
      subtitle: string
      siteUrl: string
      description: string
      menu: MenuItem[]
      footerMenu: MenuItem[]
      search: boolean
      author: {
        name: string
        description: string
        social: SocialChannels
      }
    }
  }
}

export interface Tag {
  name: string
  color: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  featured: boolean
}

export interface SocialChannels {
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string
  github?: string
  twitch?: string
  stackoverflow?: string
  rss?: string
}

export interface MenuItem {
  name: string
  path: string
}

export interface Post {
  id: string
  frontmatter: {
    title: string
    path: string
    tags: string[]
    excerpt: string
    created: string
    createdPretty: string
    updated: string
    updatedPretty: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featuredImage?: any
  }
  html: string
  headings: Array<{ depth: number }>
}

export interface Page {
  frontmatter: {
    title: string
    path: string
    excerpt: string
  }
  html: string
}
