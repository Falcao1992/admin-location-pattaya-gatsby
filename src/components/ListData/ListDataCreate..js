import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import app from "../../firebase";
import {Button, TextField, Container, Input, MenuItem, Select, InputLabel, CardMedia} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";
import { nanoid } from 'nanoid'

const ListDataCreate = () => {
    const [firebaseAllPage, setFirebaseAllPage ] = useState([]);
    const [currentImageArticle, setCurrentImageArticle] = useState("");
    const [currentImage, setCurrentImage] = useState("");

    const data = {
        articleTitle: "",
        content: "",
        location: "",
        name: "",
        page: "",
        type: "article",
        uid: nanoid(),
        urlImage: ""
    };

    const [dataArticle, setDataArticle] = useState(data);

    const {articleTitle, content, location, name, page, uid} = dataArticle;

    useEffect(() => {
        app.database().ref("/pagesPicturesData").once("value")
            .then(snapshot => {
                setFirebaseAllPage(Object.entries(snapshot.val()));
            })
            .catch((error) => {
                console.error(error)
            })
    });

    const PreviewFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (event) => {
            setCurrentImage(() => event.target.result)
        };
        setCurrentImageArticle(file);
    };

    const handleChange = (e) => {
        setDataArticle({...dataArticle, [e.target.id]: e.target.value});
    };
    const handleChangePage = (e) => {
        setDataArticle({...dataArticle, page: e.target.value});
    };

    const onSubmit = async () => {
        const uploadTask = app.storage().ref(`${page}Picture/${name}`).put(currentImageArticle);
        await uploadTask.on(`state_changed`,
            (snapshot) => {
                console.log(snapshot)
            },
            (error) => {
                console.log(error)
            },
            () => {
                 app.storage().ref(`${page}Picture`).child(name).getDownloadURL()
                    .then(url => {
                        setDataArticle({...dataArticle, urlImage: url});
                    })
            });

        await app.database().ref(`pagesPicturesData/${page}`)
            .update({
                [name]:dataArticle
            });
    };


    return (
        <Container fixed>
            <SidePanel/>
            <form autoComplete="off">
                <div>
                    <InputLabel>pages</InputLabel>
                    <SelectStyled
                        onChange={handleChangePage}
                        value={page}

                    >
                        {firebaseAllPage.map(([key]) => (<MenuItem key={key}  value={key}>{key}</MenuItem>))}
                    </SelectStyled>
                </div>

                <TextFieldStyled onChange={handleChange} value={articleTitle} required id="articleTitle" label="articleTitle"  />
                <TextFieldStyledLarge onChange={handleChange} value={content} required multiline rowsMax="4" id="content" label="content"  />
                <TextFieldStyled onChange={handleChange} value={location} required id="location" label="location"  />
                <TextFieldStyled onChange={handleChange} value={name} required id="name" label="name"  />
                <TextFieldStyledLarge value={uid} required disabled multiline rowsMax="4" id="uid" label="uid" />
                <Input type="file" margin='dense' required onChange={PreviewFile}/>
                {currentImageArticle && <CardMediaStyled
                    title="Image de l'article"
                    alt="article"
                >
                    <img src={currentImage} alt="article"/>
                    <Button
                        onClick={onSubmit}
                        color="primary" aria-label="edit">create</Button>
                </CardMediaStyled>}
            </form>
        </Container>
    )
};
const TextFieldStyled = styled(TextField)`
          width: calc(50% - 36px);
          margin: 15px 0;
          padding: 0 15px;
          display: inline-block;
    `;

const TextFieldStyledLarge = styled(TextField)`
          width: 100%;
          margin: 15px 0;
          padding: 0 15px;
    `;

const SelectStyled = styled(Select)`
          width: 100%;
    `;

const CardMediaStyled = styled(CardMedia)`
            img {
              width: 100%;
            }        
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
export default ListDataCreate
