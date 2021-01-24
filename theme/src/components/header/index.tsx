import React, { FunctionComponent } from "react"
import StyledNavigation from "../navigation"
import { Description, StyledHeader, Title, TitleWrapper } from "./style"
import { MenuItem } from "../../utils/models"

interface HeaderProps {
  title: string
  description: string
  menu: MenuItem[]
  search: boolean
}

const Header: FunctionComponent<HeaderProps> = ({
  title,
  description,
  menu,
  search = true,
}) => {
  return (
    <StyledHeader>
      <StyledNavigation title={title} menu={menu} showSearch={search} />
      <TitleWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TitleWrapper>
    </StyledHeader>
  )
}

export default Header
