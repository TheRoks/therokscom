import React from "react";
import { MenuItem } from "@nehalist/gatsby-theme-nehalem/src/utils/models";
import styled, { css } from "styled-components";
import { Link } from "gatsby";
import { theme } from "../../styles/theme";

export const StyledFooter = styled.footer`
  max-width: 100%;
  padding: 10px 0;
  z-index: 700;
  position: relative;
  font-size: 0.9em;
  margin-top: 50px;
  margin: 0;
  padding: 3em;
  padding-left: 90px;

  @media (max-width: ${theme.breakpoints.xl}) {
    padding-left: 20px;
  }
`;

export const StyledNav = styled.nav`
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline-block;
    margin-right: 25px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const LinkStyle = css`
  color: #000;
  text-decoration: none;

  :hover,
  :focus {
    text-decoration: underline;
  }
`;

export const FooterMenuItem = styled.a`
  ${LinkStyle}
`;

export const FooterMenuLink = styled(Link)`
  ${LinkStyle}
`;

interface FooterProps {
  menu: MenuItem[];
  owner: string;
}

const Footer: React.FC<FooterProps> = ({ menu }) => (
  <StyledFooter>
    <StyledNav>
      <ul>
        {menu.map((item, index) => (
          <li key={index}>        
              <FooterMenuItem href={item.path} rel="noopener noreferrer">
                {item.name}
              </FooterMenuItem>           
          </li>
        ))}
      </ul>
    </StyledNav>
  </StyledFooter>
);

export default Footer;
