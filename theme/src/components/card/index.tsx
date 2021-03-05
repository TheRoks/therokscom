import React, { CSSProperties, FunctionComponent, ReactNode } from "react"
import {
  CardContent,
  CardMeta,
  CardTitle,
  FeaturedImage,
  StyledArticle,
  StyledCard,
} from "./style"

export interface CardProps {
  title?: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  featuredImage?: any
  content?: string
  meta?: {
    time: string
    timePretty: string
    tag: string | null
  }
  compact?: boolean
  style?: CSSProperties
  children?: ReactNode
}

export const Card: FunctionComponent<CardProps> = ({
  title,
  meta,
  path,
  featuredImage,
  content,
  compact = false,
  style,
  children,
}) => (
  <StyledArticle style={style}>
    <StyledCard to={path}>
      {featuredImage && featuredImage.gatsbyImageData && (
        <FeaturedImage alt={`${title}`} image={featuredImage.gatsbyImageData} />
      )}
      <CardContent compact={compact}>
        {children}
        <header>
          {meta && (
            <CardMeta>
              {meta.tag && <>{meta.tag}</>}
              {meta.time && <time dateTime={meta.time}>{meta.timePretty}</time>}
            </CardMeta>
          )}
          {title && <CardTitle>{title}</CardTitle>}
        </header>
        {content && <p dangerouslySetInnerHTML={{ __html: content }} />}
      </CardContent>
    </StyledCard>
  </StyledArticle>
)
