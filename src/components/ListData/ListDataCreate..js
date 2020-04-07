import React, {useEffect, useState} from "react";
import app from "../../firebase";
import {Button, TextField, Container, Input, MenuItem, Select, InputLabel, CardMedia} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";
import {nanoid} from 'nanoid'
import useLocalStorage from "react-use-localstorage";
import Footer from "../SidePanel/Footer";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ListDataCreate = ({history}) => {

    const [firebaseAllPage, setFirebaseAllPage] = useState([]);
    const [currentImageArticleFile, setCurrentImageArticleFile] = useState({});
    const [currentImage, setCurrentImage] = useState("");
    const [missingField, setMissingField] = useState(false);

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

    toast.configure();

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

    const sendData = () => {
        let copyDataArticle;
        const uploadTask = app.storage().ref(`${page}Picture/${name}`).put(currentImageArticleFile);
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

    const checkFormConform = () => {
        return new Promise(function (resolve, reject) {
            if (articleTitle !== "" && content !== "" && location !== "" && name !== "" && page !== "" && currentImage !== "") {
                console.log("tout est rempli merci");
                toast.success('🦄 votre article à été correctement creé!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                sendData();
                setMissingField(false);
                resolve("resolu")
            } else {
                toast.error('🦄 veuillez remplir tout les chanps svp !', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                setMissingField(true);
                reject('pas résolu')
            }
        });
    };

    const onSubmit = async () => {
        const result = await checkFormConform()
        console.log(result)
    };

    const PreviewFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (event) => {
            setCurrentImage(() => event.target.result)
        };
        setCurrentImageArticleFile(file);
    };

    return (
        <>
            <SidePanel/>
            <Container fixed>
                <h1>ici vous pouvez creer et publier un article</h1>
                <form autoComplete="off">
                    <div>
                        <InputLabel id="page">pages</InputLabel>
                        <SelectStyled
                            labelId="page"
                            onChange={handleChangePage}
                            value={page}
                            variant="outlined"

                            error={missingField && page === "" && true}
                        >
                            {firebaseAllPage.map(([key]) => (<MenuItem key={key} value={key}>{key}</MenuItem>))}
                        </SelectStyled>
                        {missingField && page === "" ? <IncorrectField>veuillez remplir ce champ*</IncorrectField> : page !== "" && missingField ?  <CorrectField>bien rempli*</CorrectField> : false}

                    </div>

                    <TextFieldStyled onChange={handleChange} value={articleTitle} required id="articleTitle"
                                     label="articleTitle" variant="outlined"
                                     helperText={missingField && articleTitle === "" ? <small>veuillez remplir ce champ</small> : articleTitle !== "" && missingField ?  <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && articleTitle === "" && true}

                    />

                    <TextFieldStyledLarge onChange={handleChange} value={content} required multiline rowsMax="4"
                                          id="content" label="content" variant="outlined"
                                          helperText={missingField && content === "" ? "veuillez remplir ce champ" : content !== "" && missingField ?  <CorrectField>bien rempli*</CorrectField> : false}
                                          error={missingField && content === "" && true}
                    />

                    <TextFieldStyled onChange={handleChange} value={location} required id="location" label="location"
                                     variant="outlined"
                                     helperText={missingField && location === "" ? "veuillez remplir ce champ" : location !== "" && missingField ?  <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && location === "" && true}
                    />

                    <TextFieldStyled onChange={handleChange} value={name} required id="name" label="name"
                                     variant="outlined"
                                     helperText={missingField && name === "" ? "veuillez remplir ce champ" : name !== "" && missingField ?  <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && name === "" && true}
                    />

                    <TextFieldStyledLarge value={uid} disabled multiline rowsMax="4" id="uid" label="uid"
                                          variant="outlined"
                    />

                    <Input type="file" margin='dense' required onChange={PreviewFile}
                           helperText={missingField && currentImage === "" ? "veuillez remplir ce champ" : currentImage !== "" && missingField ?  <CorrectField>bien rempli*</CorrectField> : false}
                           error={missingField && currentImage === "" && true}/>

                    {currentImage !== "" && <CardMediaStyled title="Image de l'article" alt="article">
                        <img src={currentImage} alt="article"/>
                    </CardMediaStyled>
                    }

                    <ButtonCreate variant="contained" onClick={onSubmit} color="primary"
                                  aria-label="edit">create</ButtonCreate>
                </form>
            </Container>
            <Footer/>
        </>
    )
};
const CorrectField = styled.small `
          color: green
    `;
const IncorrectField = styled.small `
          color: red
    `;

const ButtonCreate = styled(Button)`
          margin: 25px 0;
    `;
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

const SelectStyled = styled(Select)`
          width: 100%;
    `;

const CardMediaStyled = styled(CardMedia)`
            img {
              width: 100%;
            }
    `;

export default ListDataCreate
