import React, {useEffect, useState} from "react";
import app from "../../firebase";
import {Button, Container, TextField} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";
import Footer from "../SidePanel/Footer";
import {ArticleContent, ArticleLocation, SeeMoreLink} from "../StyledComponents/ArticlePreview";
import moment from "moment";

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
        currentDataEdit.dateUpdated = moment().format();
        app.database().ref(`/pagesPicturesData/${pageChoose}`)
            .update({
                [articleName]: currentDataEdit
            });
        history.push("/listData");
    };

    return (
        <>
            <SidePanel/>
            {currentDataEdit && [currentDataEdit].map((article, index) => {
                const {name, urlImage, articleTitle, location, type, content, source} = currentDataEdit;
                return (
                    <Container fixed key={index}>
                        <PageBlockTitleDescription>
                            <h1>Editer un article existant</h1>
                            <p>veuillez remplir tout les champs non grisé svp :</p>
                        </PageBlockTitleDescription>
                        <div>
                            <ArticleContent id={name}>
                                <img src={urlImage} alt={name}/>
                                <ArticleLocation><span>{articleTitle}</span>{location}</ArticleLocation>
                                <p>{content}</p>
                                {source && <p>{source}</p>}
                                {type === "category" &&
                                <SeeMoreLink to="/"><span>voir plus ></span></SeeMoreLink>}
                            </ArticleContent>

                        </div>
                        {currentDataEdit && Object.entries(currentDataEdit).map((value, index) => {
                                return (
                                        <div key={index}>
                                                <TextFieldStyled
                                                disabled={(value[1] === "article" || value[0] === "uid" || value[0] === "name" || value[0] === "page" || value[0] === "uid" || value[0] === "urlImage") && true}
                                                onChange={(e) => handleEditData(e, value[0])}
                                                multiline rowsMax="2"
                                                required label={value[0]}
                                                defaultValue={value[1]}
                                                />
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
const PageBlockTitleDescription = styled.div`
        margin-bottom: 20px;
        h1 {
        font-family: ${props => props.theme.font.title}, sans-serif;
        font-size: 1.7em;     
        }      
    `;

const TextFieldStyled = styled(TextField)`
        width: 100%;
        margin-bottom: 15px !important;  
    `;


export default ListDataEdit
