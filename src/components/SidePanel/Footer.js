import React from "react";
import styled from "styled-components";

const Footer = () => {
    return (
        <FooterContainer>
            <p>footer</p>
        </FooterContainer>
    )
};

const FooterContainer = styled.div`
      background-color: ${props => props.theme.color.primary};
      height: 300px;
  `;
export default Footer
