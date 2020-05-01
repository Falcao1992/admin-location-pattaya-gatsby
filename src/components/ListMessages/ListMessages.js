import React, {useEffect, useState} from "react";
import SidePanel from "../SidePanel/SidePanel";
import {Container} from "@material-ui/core";
import app from "../../firebase";
import {ListMessagesTables} from "./ListMessagesTable";
import {CircularLoadingContainer, CircularLoading} from "../StyledComponents/Loader";

const ListMessages = () => {

    const [firebaseAllDataMessages, setFirebaseAllDataMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchDataMessages = async () => {
            try {
                setIsLoading(true);
                const dbRef = app.database().ref("/contactMessage");
                const snapshot = await dbRef.once("value");
                const value = snapshot.val();
                setFirebaseAllDataMessages(value);

                setIsLoading(false);
            } catch (e) {
                console.error(e)
            }
        };
        fetchDataMessages()

    }, []);

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
                <ListMessagesTables dataMessages={firebaseAllDataMessages}/>
            </Container>
        </>
    )
};

export default ListMessages
