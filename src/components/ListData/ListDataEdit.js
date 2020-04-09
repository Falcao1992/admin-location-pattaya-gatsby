import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import app from "../../firebase";
import {Button, TextField, Container} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";
import Footer from "../SidePanel/Footer";

const ListDataEdit = ({location, history}) => {
    const [currentDataEdit, setCurrentDataEdit] = useState({});
    const {dataArticle, pageChoose} = location.state;

    useEffect(() => {
        setCurrentDataEdit(dataArticle)

    }, [dataArticle]);

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
                [articleName]: currentDataEdit
            });
        history.push("/listData");
    };

    return (
        <>
            <SidePanel/>
            <div>
                <h1>Editer un article existant</h1>
                <p>veuillez remplir tout les champs non grisé svp :</p>
            </div>
            {currentDataEdit && [currentDataEdit].map((article, index) => {
                const {name, urlImage, articleTitle, location, type, content} = currentDataEdit;
                return (
                    <Container fixed key={index}>

                        <div>
                            <ArticleContent id={name}>
                                <ArticleImage src={urlImage} alt={name}/>
                                <ArticleLocation><span>{articleTitle}</span>{location}</ArticleLocation>
                                <p>{content}</p>
                                {type === "category" &&
                                <SeeMoreLink to="/"><span>voir plus ></span></SeeMoreLink>}
                            </ArticleContent>

                        </div>
                        {currentDataEdit && Object.entries(currentDataEdit).map((value, index) => {
                                return (
                                        <div key={index}>
                                            {value[0] === "content" || value[0] === "uid" || value[0] === "urlImage" || value[0] === "articleTitle"
                                        ?
                                                <TextFieldStyledLarge
                                                    disabled={(value[0] === "uid" || value[0] === "urlImage") && true}
                                                    onChange={(e) => handleEditData(e, value[0])}
                                                    multiline rowsMax="4"
                                                    required label={value[0]}
                                                    defaultValue={value[1]}
                                                />
                                        :
                                                <TextFieldStyled
                                                disabled={(value[1] === "article" || value[0] === "uid" || value[0] === "name" || value[0] === "page") && true}
                                                onChange={(e) => handleEditData(e, value[0])}
                                                multiline rowsMax="2"
                                                required label={value[0]}
                                                defaultValue={value[1]}
                                                />
                                            }
                                        </div>
                                )})}
                        <div>
                            <Button variant="contained" color="primary" onClick={(e) => submitEdit(e,article.name) }> sauvegarder changement</Button>
                        </div>
                    </Container>
                )
            })}
            <Footer/>
        </>
    )
};
const TextFieldStyled = styled(TextField)`
        width: calc(50% - 36px);
        padding-right: 25px;
        margin: 15px 0;
        display: inline-block;
    `;

const TextFieldStyledLarge = styled(TextField)`
          width: 100%;
          margin: 15px 0;
    `;

const ArticleContent = styled.div`
          width: 100%;     
          margin-bottom: 20px
    `;

const ArticleImage = styled.img`
          width: 100%      
    `;

const SeeMoreLink = styled(Link)`
        text-decoration: none;
            span {
                color: ${props => props.theme.color.secondary};
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
            color: ${props => props.theme.color.secondary};
            display: block;
            font-size: 2.1rem;
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
export default ListDataEdit
