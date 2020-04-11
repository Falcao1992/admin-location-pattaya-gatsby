import styled from "styled-components";
import {Link} from "react-router-dom";

export const ArticleContent = styled.div`
          width: 100%;
          padding: 5px 0;
          margin-bottom: 20px;
              img {
                  width: 100%;
                  border: 1px solid ${props => props.theme.color.secondary};
                  margin-bottom: 10px; 
              }
    `;

export const ArticleLocation = styled.h3`
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        line-height: 1.2;
        margin-left: 5px;
        padding-bottom: 15px;
           span {
            text-transform: none;
            padding-bottom: 5px;
            font-family: 'pinyon script' , sans-serif;
            color: ${props => props.theme.color.secondary};
            display: block;
            font-size: 1.8rem;
            letter-spacing: 1px;
           }
        &::before {
            display: block;
            content: "";
            width: 24px;
            height: 2px;
            background: ${props => props.theme.color.secondary};
            margin-bottom: 10px;
            clear: both;
        }  
    `;

export const SeeMoreLink = styled(Link)`
        text-decoration: none;
            span {
                color: ${props => props.theme.color.secondary};
                &:hover {
                    text-decoration: underline;
                }
            }
    `;
