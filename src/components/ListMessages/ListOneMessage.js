import React, {useEffect} from "react";
import moment from "moment";
import SidePanel from "../SidePanel/SidePanel";
import {DisplayCalendar} from "./DisplayCalendar";
import styled from "styled-components";
import Footer from "../SidePanel/Footer";
import app from "../../firebase";
import {Button} from "@material-ui/core";

const ListOneMessage = ({location, history}) => {
    const {message} = location.state;

    useEffect(() => {
        handleIsRead()
    });

    const handleIsRead = () => {
        app.database().ref(`/contactMessage/${message.key}`)
            .update({
                read: "true"
            });
    };

    const handleDeleteMessage = () => {
        app.database().ref(`/contactMessage/${message.key}`).remove().then(() => {history.push("/listMessages")});
        console.log(message.key)
    };

    return (
        <>
            <SidePanel/>
            <ContainerOneMessage>
                <BlockTitle>
                    <h3>{`${message.name} ${message.firstName} `}<span> Le {moment(message.dateMessage).format('LLLL')}</span></h3>
                    <p>Du {moment(message.dateStartReservation).format('ll')} au {moment(message.dateEndReservation).format('ll')} pour {message.numberPeople} personnes</p>
                </BlockTitle>
                <BlockMessage>
                    <p>{message.message}</p>
                </BlockMessage>
                {message.dateStartReservation && message.dateEndReservation && <DisplayCalendar rangeDate={[new Date(message.dateStartReservation),new Date(message.dateEndReservation)]}/>}
            </ContainerOneMessage>
            <Button variant="contained" color="secondary"
                    onClick={handleDeleteMessage}> Supprimer</Button>
            <Footer/>
        </>
    )
};

const BlockTitle = styled.div`
    h3 {
        font-family: ${props => props.theme.font.title};
        font-size: 1.3rem;
        margin-bottom: 0.3rem;
    }
    
    span {
        font-size: 0.8rem;
    }
`

const ContainerOneMessage = styled.div`
    width: 90%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const BlockMessage = styled.div`
    margin: 1rem 0;
    border: 1px solid ${props => props.theme.color.secondary};
    padding: 0.5rem;
`

export default ListOneMessage
