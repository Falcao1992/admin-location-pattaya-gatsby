import React, {useState, useEffect} from "react"
import app from "../../firebase";
import {makeStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import useLocalStorage from 'react-use-localstorage';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';


import {
    MenuItem,
    FormControl,
    InputLabel,
    Container, Select, Button
} from "@material-ui/core";
import SidePanel from "../SidePanel/SidePanel";
import styled from "styled-components";
import Footer from "../SidePanel/Footer";


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
    const [firebaseCurrentPageData, setFirebaseCurrentPageData] = useState([]);
    const [firebaseCurrentDataArticle, setFirebaseCurrentDataArticle] = useState([]);

    const [pageChoose, setPageChoose] = useLocalStorage("page choose", '');
    const [articleChoose, setArticleChoose] = useLocalStorage("article choose", '');


    useEffect(() => {
        try {
            const fetchData = async () => {
                if (pageChoose === "") {
                    console.log("first");
                    return app.database().ref("/pagesPicturesData").on("value", function (snapshot) {
                        setFirebaseAllData(Object.entries(snapshot.val()));
                    });
                } else if (pageChoose && !articleChoose) {
                    console.log("second");
                    return app.database().ref(`/pagesPicturesData/${pageChoose}`).on("value", function (snapshot) {
                        setFirebaseCurrentPageData(Object.entries(snapshot.val()));
                    });
                } else if (articleChoose) {
                    console.log("three");
                    app.database().ref(`/pagesPicturesData/${pageChoose}/${articleChoose}`).on("value", function (snapshot) {
                        setFirebaseCurrentDataArticle(snapshot.val());
                    });
                    if(articleChoose && firebaseAllData.length === 0) {
                        app.database().ref("/pagesPicturesData").on("value", function (snapshot) {
                            setFirebaseAllData(Object.entries(snapshot.val()));
                        });
                        app.database().ref(`/pagesPicturesData/${pageChoose}`).on("value", function (snapshot) {
                            setFirebaseCurrentPageData(Object.entries(snapshot.val()));
                        });
                    }
                }
            };
            fetchData()

        } catch (e) {
            console.error(e)
        }


    }, [pageChoose, articleChoose]);


    const handlePageChoose = (e) => {
        setArticleChoose("");
        setPageChoose(e.target.value)
    };

    const clearStorageData = () => {
        setArticleChoose("");
        setPageChoose("")
    };

    const deleteArticle = () => {
        app.database().ref(`/pagesPicturesData/${pageChoose}/${articleChoose}`).remove()
        setArticleChoose("");
        setPageChoose("");

    };

    if (firebaseCurrentDataArticle.length === 0) {
        return (
            <CircularLoadingContainer>
                <CircularLoading/>
            </CircularLoadingContainer>
        )
    }

    return (
        <>
            <SidePanel/>
            <Container fixed>
                <SelectContainer>
                    {(firebaseAllData || firebaseCurrentPageData.length !== 0) &&
                    <>
                        <FormControl className={classes.formControl}>
                            <InputLabel>pages</InputLabel>
                            <Select
                                value={pageChoose}
                                onChange={(e) => handlePageChoose(e)}
                            >
                                {firebaseAllData.map(([key]) => (<MenuItem key={key} value={key}>{key}</MenuItem>))}
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel>articles</InputLabel>
                            <Select
                                disabled={!pageChoose}
                                value={articleChoose}
                                onChange={(e) => setArticleChoose(e.target.value)}
                            >
                                {firebaseCurrentPageData.map(([key]) => (
                                    <MenuItem key={key} value={key}>{key}</MenuItem>))}
                            </Select>
                        </FormControl>
                        {articleChoose && pageChoose &&
                        <Button type="button" onClick={clearStorageData}><RefreshIcon/></Button>}
                    </>
                    }
                </SelectContainer>

                {firebaseCurrentDataArticle && [firebaseCurrentDataArticle].map((article, index) => {
                    const {name, urlImage, articleTitle, location, type, content} = article;
                    return (
                        <div key={index}>
                            <ArticleContent id={name}>
                                <ArticleImage src={urlImage} alt={name}/>
                                <ArticleLocation><span>{articleTitle}</span>{location}</ArticleLocation>
                                <p>{content}</p>
                                {type === "category" && <SeeMoreLink to="/"><span>voir plus ></span></SeeMoreLink>}
                            </ArticleContent>
                            {articleChoose && pageChoose && <ContainerButton>
                                <Link to={{
                                    pathname: `/listData/edit/${name}`, state: {
                                        firebaseCurrentDataArticle, pageChoose
                                    }
                                }}><Button variant="contained" color="primary"> modifier</Button></Link>

                                <Button variant="contained" color="secondary"
                                        onClick={deleteArticle}> Supprimer</Button>
                            </ContainerButton>}

                        </div>
                    )
                })}
                <CreateButtonContainer>
                    <Link to="/listData/create"><Button variant="contained" color="primary"> Creer un nouvelle
                        article</Button></Link>
                </CreateButtonContainer>

            </Container>
            <Footer/>
        </>
    )
};
const CircularLoadingContainer = styled.div`
        height: 100vh;
        display: flex;
            div {
                height: 0;
                width: 0;
                display: table;
            }
            svg{
                height: 90px;
            }
    `;

const CircularLoading = styled(CircularProgress)`
        margin: 0 auto;
        align-self: center;
    `;

const SelectContainer = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    `;

const CreateButtonContainer = styled.div`
        justify-content: center;
        display: flex;
        margin: 20px;
    `;
const ArticleContent = styled.div`
          width: 100%;
          padding: 5px 0;
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
const ContainerButton = styled.div`
      display: flex;
      justify-content: space-between;
    `;

export default ListData
