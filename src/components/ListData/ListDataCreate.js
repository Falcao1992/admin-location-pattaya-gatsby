import React, {useEffect, useState} from "react";
import app from "../../firebase";
import {Button, TextField, Container, Input, MenuItem, Select, InputLabel, CardMedia} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";
import {nanoid} from 'nanoid'
import Footer from "../SidePanel/Footer";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {toCamelCaseString} from "../globalFunction";
import moment from "moment";

const ListDataCreate = ({history}) => {

    const [firebaseAllPage, setFirebaseAllPage] = useState([]);
    const [currentImageArticleFile, setCurrentImageArticleFile] = useState({});
    const [currentImage, setCurrentImage] = useState("");
    const [missingField, setMissingField] = useState(false);

    const [nameBeforeTransform, setNameBeforeTransform] = useState("");

    const data = {
        articleTitle: "",
        content: "",
        location: "",
        date: "",
        dateUpdated: "",
        name: "",
        page: "",
        type: "article",
        uid: nanoid(),
        urlImage: "",
        source: ""
    };
    const [dataArticle, setDataArticle] = useState(data);
    const {articleTitle, content, location, name, page, uid, source} = dataArticle;

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
    };

    const handleChangeName = (e) => {
        if (e.target.id === "name") {
            setNameBeforeTransform(e.target.value);
            let value = toCamelCaseString(e.target.value);
            setDataArticle({...dataArticle, name: value});
        } else {
            console.log("pas name")
        }
    };

    const handleChangePage = (e) => {
        setDataArticle({...dataArticle, page: e.target.value});
        localStorage.setItem("page choose", e.target.value)
    };

    const sendData = () => {
        let copyDataArticle;
        if(dataArticle.source === ""){
            dataArticle.source = "none"
        }
        dataArticle.date = moment().format();
        dataArticle.dateUpdated = moment().format();
        localStorage.setItem("article choose", toCamelCaseString(nameBeforeTransform));
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
        const result = await checkFormConform();
        console.log(result)
    };

    const PreviewFile = (e) => {
        try {
            const file = e.target.files[0];
            console.log(file, "file")
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (event) => {
                setCurrentImage(() => event.target.result)
            };
            setCurrentImageArticleFile(file);
        } catch (error) {
            console.error(error)
        }

    };

    return (
        <>
            <SidePanel/>
            <Container fixed>
                <PageBlockTitleDescription>
                    <h1>Creer un nouvel article</h1>
                    <p>veuillez remplir tout les champs non grisé svp :</p>
                </PageBlockTitleDescription>
                <FormStyled autoComplete="off">
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
                        {missingField && page === "" ?
                            <IncorrectField>veuillez remplir ce champ*</IncorrectField> : page !== "" && missingField ?
                                <CorrectField>bien rempli*</CorrectField> : false}

                    </div>

                    <TextFieldStyled onChange={handleChange} value={articleTitle} required id="articleTitle"
                                     label="articleTitle" variant="outlined"
                                     helperText={missingField && articleTitle === "" ? <small>veuillez remplir ce
                                         champ</small> : articleTitle !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && articleTitle === "" && true}

                    />

                    <TextFieldStyled onChange={handleChange} value={content} required multiline rowsMax="4"
                                     id="content" label="content" variant="outlined"
                                     helperText={missingField && content === "" ? "veuillez remplir ce champ" : content !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && content === "" && true}
                    />

                    <TextFieldStyled onChange={handleChange} value={source} multiline rowsMax="2"
                                     id="source" label="source (falcutatif)" variant="outlined"
                    />

                    <TextFieldStyled onChange={handleChange} value={location} required id="location" label="location"
                                     variant="outlined"
                                     helperText={missingField && location === "" ? "veuillez remplir ce champ" : location !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && location === "" && true}
                    />

                    <TextFieldStyled onChange={handleChangeName} value={nameBeforeTransform} required id="name"
                                     label="name"
                                     variant="outlined"
                                     helperText={missingField && name === "" ? "veuillez remplir ce champ" : name !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && name === "" && true}
                    />

                    <TextFieldStyled value={name} disabled id="name" label="name final"
                                     variant="outlined"
                                     helperText={missingField && name === "" ? "veuillez remplir ce champ" : name !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && name === "" && true}
                    />

                    <TextFieldStyled value={uid} disabled multiline rowsMax="4" id="uid" label="uid"
                                     variant="outlined"
                    />

                    <Input type="file" margin='dense' required onChange={PreviewFile}
                           error={missingField && currentImage === "" && true}/>
                    {currentImage !== "" &&
                    <CardMediaStyled title="Image de l'article" alt="article">
                        <img src={currentImage} alt="article"/>
                    </CardMediaStyled>
                    }

                    <ButtonCreate variant="contained" type="button" onClick={onSubmit} color="primary"
                                  aria-label="edit">create</ButtonCreate>
                </FormStyled>
            </Container>
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

const CorrectField = styled.small`
          color: green
    `;
const IncorrectField = styled.small`
          color: red
    `;

const ButtonCreate = styled(Button)`
          margin-top: 15px !important;
    `;

const FormStyled = styled.form`
        display: flex;
        flex-direction: column;        
         input {
             margin-bottom: 15px;
         }
        `;

const SelectStyled = styled(Select)`
          width: 100%;
          margin-bottom: 15px;
    `;

const TextFieldStyled = styled(TextField)`
        width: 100%;
        margin-bottom: 15px !important;                     
    `;

const CardMediaStyled = styled(CardMedia)`
            img {
              width: 100%;
            }
    `;

export default ListDataCreate
