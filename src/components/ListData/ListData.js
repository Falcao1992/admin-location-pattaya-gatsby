import React, {useState, useEffect} from "react"
import app from "../../firebase";
import {makeStyles} from '@material-ui/core/styles';

import {
    MenuItem,
    FormControl,
    InputLabel,
    Container, Select
} from "@material-ui/core";


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
    const [firebaseCurrentData, setFirebaseCurrentPageData] = useState([]);
    const [firebaseCurrentDataArticle, setFirebaseCurrentPageDataArticle] = useState([]);
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
                    setFirebaseCurrentPageDataArticle(Object.entries(snapshot.val()));
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
                    {firebaseCurrentData.map(([key]) => (<MenuItem key={key} value={key}>{key}</MenuItem>))}
                </Select>
            </FormControl>

            {firebaseCurrentDataArticle && firebaseCurrentDataArticle.map(([key,article]) => {
                    return <p key={key}>{key}: {article}</p>
            })}
        </Container>
    )
};

export default ListData
