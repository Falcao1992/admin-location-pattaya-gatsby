import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import app from "../../firebase";
import {Button, TextField, Container} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";

const ListDataEdit = ({location, history}) => {
    const [currentDataEdit, setCurrentDataEdit] = useState({});
    const {firebaseCurrentDataArticle, pageChoose} = location.state;

    useEffect(() => {
        setCurrentDataEdit(firebaseCurrentDataArticle)

    }, [firebaseCurrentDataArticle]);

    console.log(Object.entries(currentDataEdit))

    const handleEditData = (e, label) => {
        if (typeof currentDataEdit === 'object') {
            const inputVal = e.target.value;
            const result = {...currentDataEdit};
            result[label] = inputVal;
            setCurrentDataEdit(result)
        }
    };

    const submitEdit = (e,articleName) => {
        e.preventDefault();
        app.database().ref(`/pagesPicturesData/${pageChoose}`)
            .update({
                [articleName] :currentDataEdit
            });
        history.push("/listData");
    };

    return (
        <>
            {currentDataEdit && [currentDataEdit].map((article, index) => {
                return (
                    <Container fixed key={index}>
                        <SidePanel/>
                        <div>
                            <ArticleContent id={article.name}>
                                <ArticleImage src={article.urlImage} alt={article.name}/>
                                <ArticleLocation><span>{article.articleTitle}</span>{article.location}</ArticleLocation>
                                <p>{article.content}</p>
                                {article.type === "category" &&
                                <SeeMoreLink to="/"><span>voir plus ></span></SeeMoreLink>}
                            </ArticleContent>

                        </div>
                        {currentDataEdit && Object.entries(currentDataEdit).map((value, index) => {
                                return (
                                        <div key={index}>
                                            {value[0] === "content" || value[0] === "uid" || value[0] === "urlImage" || value[0] === "articleTitle"
                                        ?
                                                <TextFieldStyledLarge
                                                    disabled={(value[1] === "article" || value[0] === "uid" || value[0] === "name") && true}
                                                    onChange={(e) => handleEditData(e, value[0])}
                                                    multiline rowsMax="4"
                                                    required label={value[0]}
                                                    defaultValue={value[1]}
                                                />
                                        :
                                                <TextFieldStyled
                                                disabled={(value[1] === "article" || value[0] === "uid" || value[0] === "name") && true}
                                                onChange={(e) => handleEditData(e, value[0])}
                                                multiline rowsMax="2"
                                                required label={value[0]}
                                                defaultValue={value[1]}
                                                />
                                            }

                                        </div>
                                )
                            }
                        )
                        }
                        <div>
                            <Button variant="contained" color="primary" onClick={(e) => submitEdit(e,article.name) }> sauvegarder changement</Button>
                        </div>
                    </Container>
                )
            })}
        </>
    )
};
const TextFieldStyled = styled(TextField)`
          width: calc(50% - 36px);
          margin: 20px 0;
          padding: 0 15px;
          display: inline-block;
    `;

const TextFieldStyledLarge = styled(TextField)`
          width: 100%;
          margin: 20px 0;
          padding: 0 15px;
    `;

const ArticleContent = styled.div`
          width: 100%;
          padding: 5px 10px;
          margin-bottom: 20px
    `;

const ArticleImage = styled.img`
          width: 100%      
    `;

const SeeMoreLink = styled(Link)`
        text-decoration: none;
            span {
                color: #C89446;
                &:hover {
                    text-decoration: underline;
                }
            }
    `;

const ArticleLocation = styled.h3`
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        line-height: 1.2;
        margin-left: 5px;
           span {
            text-transform: none;
            font-family: 'pinyon script' , sans-serif;
            color: #C89446;
            display: block;
            font-size: 2.1rem;
            letter-spacing: 1px;
           }
        &::before {
            display: block;
            content: "";
            width: 24px;
            height: 2px;
            background: #C89446;
            margin-bottom: 10px;
            clear: both;
        }  
    `;
export default ListDataEdit
