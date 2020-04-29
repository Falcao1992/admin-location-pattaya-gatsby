import React, {useState, useEffect} from "react"
import app from "../../firebase";
import {makeStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import useLocalStorage from 'react-use-localstorage';
import RefreshIcon from '@material-ui/icons/Refresh';
import {CircularLoadingContainer, CircularLoading} from "../StyledComponents/Loader";


import {
    MenuItem,
    FormControl,
    InputLabel,
    Container, Select, Button
} from "@material-ui/core";
import SidePanel from "../SidePanel/SidePanel";
import styled from "styled-components";
import Footer from "../SidePanel/Footer";
import {toast} from "react-toastify";
import {ArticleContent, ArticleLocation, SeeMoreLink} from "../StyledComponents/ArticlePreview";


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const ListData = () => {
    const classes = useStyles();
    const [firebaseAllData, setFirebaseAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDelete, setIsDelete] = useState(true);

    const [pageChoose, setPageChoose] = useLocalStorage("page choose", "");
    const [articleChoose, setArticleChoose] = useLocalStorage("article choose", "");

    toast.configure();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const dbRef = app.database().ref("/pagesPicturesData");
                const snapshot = await dbRef.once("value");
                const value = snapshot.val();
                setFirebaseAllData(value);

                setIsLoading(false);
                setIsDelete(false);
            } catch (e) {
                console.error(e)
            }
        };
        fetchData()

    }, [isDelete]);


    const handlePageChoose = (e) => {
        setArticleChoose("");
        setPageChoose(e.target.value)
    };

    const clearStorageData = () => {
        setArticleChoose("");
        setPageChoose("")
    };

    const deleteArticle = () => {
        // Create a reference to the file to delete
        const imageStorage = app.storage().ref(`${pageChoose}Picture/${articleChoose}`);
        // Delete the file
        imageStorage.delete()
            .then(() => {
                toast.success(`L'article ${articleChoose} de la page ${pageChoose} à été correctement supprimé !!!`, {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            })
            .catch((error) => {
            console.error(error)
        });
        app.database().ref(`/pagesPicturesData/${pageChoose}/${articleChoose}`).remove();


        setIsDelete(true);
        setArticleChoose("");
        setPageChoose("");

    };

    const displayArticleSelect = (page) => {
        if (pageChoose && isLoading === false) {
            const dataSelectNamePage = firebaseAllData[page];
            console.log(dataSelectNamePage, "dataSelectNamePage");
            return Object.keys(dataSelectNamePage).map(nameArticle => <MenuItem key={nameArticle}
                                                                                value={nameArticle}>{nameArticle}</MenuItem>)
        }
    };

    const displayArticleData = (page, article) => {
        if (pageChoose && articleChoose && isLoading === false) {
            const dataArticle = firebaseAllData[page][article];
            const {name, urlImage, articleTitle, location, type, content} = dataArticle;
            return (
                <div key={name}>
                    <ArticleContent id={name}>
                        <img src={urlImage} alt={name}/>
                        <ArticleLocation><span>{articleTitle}</span>{location}</ArticleLocation>
                        <p>{content}</p>
                        {type === "category" && <SeeMoreLink to="/"><span>voir plus ></span></SeeMoreLink>}
                    </ArticleContent>
                    {articleChoose && pageChoose && <ContainerButton>
                        <Link to={{
                            pathname: `/listData/edit/${name}`, state: {
                                dataArticle, pageChoose
                            }
                        }}><Button variant="contained" color="primary"> modifier</Button></Link>

                        <Button variant="contained" color="secondary"
                                onClick={deleteArticle}> Supprimer</Button>
                    </ContainerButton>}

                </div>
            )
        }
    };

    if (isLoading) {
        return (
            <>
                <SidePanel/>
                <CircularLoadingContainer>
                    <CircularLoading/>
                </CircularLoadingContainer>
            </>
        )
    }

    return (
        <>
            <SidePanel/>
            <Container fixed>
                <PageBlockTitleDescription>
                    <h1>Visionner tout mes articles</h1>
                    <p>Veuillez choisir une page ci-dessous, puis un article pour le visioner :</p>
                </PageBlockTitleDescription>
                <SelectContainer>
                    {firebaseAllData &&
                    <>
                        <FormControl className={classes.formControl}>
                            <InputLabel>pages</InputLabel>
                            <Select
                                value={pageChoose}
                                onChange={(e) => handlePageChoose(e)}
                            >
                                {Object.entries(firebaseAllData).map(([key]) => (
                                    <MenuItem key={key} value={key}>{key}</MenuItem>))}
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel>articles</InputLabel>
                            <Select
                                disabled={!pageChoose}
                                value={articleChoose}
                                onChange={(e) => setArticleChoose(e.target.value)}
                            >
                                {displayArticleSelect(pageChoose)}
                            </Select>
                        </FormControl>

                        {articleChoose && pageChoose &&
                        <Button type="button" onClick={clearStorageData}><RefreshIcon/></Button>}
                    </>
                    }
                </SelectContainer>

                {displayArticleData(pageChoose, articleChoose)}

                <CreateButtonContainer>
                    <Link to="/listData/create"><Button variant="contained" color="primary"> Creer un nouvelle
                        article</Button></Link>
                </CreateButtonContainer>

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

const SelectContainer = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        background-color: ${props => props.theme.color.primary};
        margin-bottom: 20px;
        padding: 15px 0;
    `;

const CreateButtonContainer = styled.div`
        justify-content: center;
        display: flex;
        margin: 20px;
    `;


const ContainerButton = styled.div`
      display: flex;
      justify-content: space-between;
    `;

export default ListData
