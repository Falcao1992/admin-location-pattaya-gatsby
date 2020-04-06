import React, {useEffect, useState} from "react";
import app from "../../firebase";
import {Button, TextField, Container, Input, MenuItem, Select, InputLabel, CardMedia} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";
import {nanoid} from 'nanoid'
import useLocalStorage from "react-use-localstorage";

const ListDataCreate = ({history}) => {

    const [firebaseAllPage, setFirebaseAllPage] = useState([]);
    const [currentImageArticle, setCurrentImageArticle] = useState({});
    const [currentImage, setCurrentImage] = useState("");
    const [pageChoose, setPageChoose] = useLocalStorage("page choose", "");
    const [articleChoose, setArticleChoose] = useLocalStorage("article choose", "");
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
    }, []);

    const handleChange = (e) => {
        setDataArticle({...dataArticle, [e.target.id]: e.target.value});
        if (e.target.id === "name") {
            setArticleChoose(e.target.value)
        }
    };
    const handleChangePage = (e) => {
        setDataArticle({...dataArticle, page: e.target.value});
        setPageChoose(e.target.value)
    };

    const onSubmit = () => {
        let copyDataArticle;
        const uploadTask = app.storage().ref(`${page}Picture/${name}`).put(currentImageArticle);
        uploadTask.on(`state_changed`,
            (snapshot) => {
                console.log(snapshot)
            },
            (error) => {
                console.log(error)
            },
            () => {
                app.storage().ref(`${page}Picture`).child(name).getDownloadURL()
                    .then(url => {
                        copyDataArticle = dataArticle;
                        dataArticle.urlImage = url;
                        return copyDataArticle
                    })
                    .then((dataUpdate) => {
                        console.log(dataUpdate);
                        app.database().ref(`pagesPicturesData/${page}`)
                            .update({
                                [name]: dataUpdate
                            });
                        history.push("/listData");
                    })
                    .catch(e => {
                        console.error(e)
                    })
            });
    };

    const PreviewFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (event) => {
            setCurrentImage(() => event.target.result)
        };
        setCurrentImageArticle(file);
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
                        {firebaseAllPage.map(([key]) => (<MenuItem key={key} value={key}>{key}</MenuItem>))}
                    </SelectStyled>
                </div>

                <TextFieldStyled onChange={handleChange}
                                 value={articleTitle}
                                 required
                                 id="articleTitle"
                                 label="articleTitle"/>

                <TextFieldStyledLarge onChange={handleChange}
                                      value={content}
                                      required
                                      multiline rowsMax="4"
                                      id="content"
                                      label="content"/>

                <TextFieldStyled onChange={handleChange}
                                 value={location}
                                 required
                                 id="location"
                                 label="location"/>

                <TextFieldStyled onChange={handleChange}
                                 value={name}
                                 required id="name"
                                 label="name"/>

                <TextFieldStyledLarge value={uid}
                                      required
                                      disabled
                                      multiline rowsMax="4"
                                      id="uid"
                                      label="uid"/>

                <Input type="file"
                       margin='dense'
                       required
                       onChange={PreviewFile}/>
                {currentImageArticle &&
                    <CardMediaStyled
                        title="Image de l'article"
                        alt="article"
                    >
                        <img src={currentImage} alt="article"/>
                        <Button
                            onClick={onSubmit}
                            color="primary" aria-label="edit">create
                        </Button>
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

export default ListDataCreate
