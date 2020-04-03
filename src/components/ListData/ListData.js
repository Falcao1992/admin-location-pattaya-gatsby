import React, {useState, useEffect} from "react"
import app from "../../firebase";
import {makeStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";

import {
    MenuItem,
    FormControl,
    InputLabel,
    Container, Select
} from "@material-ui/core";
import SidePanel from "../SidePanel/SidePanel";
import styled from "styled-components";


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
    const [pageChoose, setPageChoose] = useState("");
    const [articleChoose, setArticleChoose] = useState("");


    useEffect(() => {
        if (pageChoose === "") {
            console.log("premier")
            app.database().ref("/pagesPicturesData").once("value")
                .then(snapshot => {
                    setFirebaseAllData(Object.entries(snapshot.val()));
                })
                .catch((error) => {
                    console.error(error)
                })
        }

        else if (pageChoose && !articleChoose) {
            console.log("deuxieme")
            app.database().ref(`/pagesPicturesData/${pageChoose}`).once("value")
                .then(snapshot => {
                    setFirebaseCurrentPageData(Object.entries(snapshot.val()));
                })
                .catch((error) => {
                    console.error(error)
                })
        }

        else if (articleChoose) {
            console.log("troisieme")
            app.database().ref(`/pagesPicturesData/${pageChoose}/${articleChoose}`).once("value")
                .then(snapshot => {
                    setFirebaseCurrentDataArticle(snapshot.val());
                    console.log(snapshot.val())
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [pageChoose, articleChoose]);


    const handlePageChoose = (e) => {
        setArticleChoose("");
        setPageChoose(e.target.value)
    };

    return (
        <Container fixed>
            <SidePanel/>
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
                    value={articleChoose}
                    onChange={(e) => setArticleChoose(e.target.value)}
                >
                    {firebaseCurrentPageData.map(([key]) => (<MenuItem key={key} value={key}>{key}</MenuItem>))}
                </Select>
            </FormControl>

            {firebaseCurrentDataArticle && [firebaseCurrentDataArticle].map((article, index) => {
                return (
                    <ArticleContent id={article.name} key={index}>
                        <ArticleImage src={article.urlImage} alt={article.name}/>
                        <ArticleLocation><span>{article.articleTitle}</span>{article.location}</ArticleLocation>
                        <p>{article.content}</p>
                        {article.type === "category" && <SeeMoreLink to="/"><span>voir plus ></span></SeeMoreLink>}
                    </ArticleContent>
                )
            })}
            {firebaseCurrentDataArticle && Object.entries(firebaseCurrentDataArticle).map(([key,article]) => {
                return <p key={key}>{key}: {article}</p>
            })}
        </Container>
    )
};

const ArticleContent = styled.div`
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

export default ListData
