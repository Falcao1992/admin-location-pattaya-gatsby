import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";

// Import Components of Material-Ui
import {Drawer, Button, List, Divider, ListItem, ListItemText,ListItemIcon, makeStyles } from '@material-ui/core';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import CreateIcon from '@material-ui/icons/Create';
import ListIcon from '@material-ui/icons/List';
import styled from "styled-components";
import app from "../../firebase";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    listItem: {
        color: 'black',
        textDecoration: 'none'
    }
});

const SidePanel = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [numberNewMessages, setNumberNewMessages] = useState({});

    useEffect(() => {
        const fetchDataMessages = async () => {
            try {
                const dbRef = app.database().ref("/contactMessage");
                const snapshot = await dbRef.once("value");
                const value = snapshot.val();
                const FilterNewMessages = Object.values(value).filter(msg => msg.read === "false")
                console.log(FilterNewMessages)
                setNumberNewMessages(FilterNewMessages.length);
            } catch (e) {
                console.error(e)
            }
        };
        fetchDataMessages()

    }, []);

    const toggleDrawer = (open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const sideList = () => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <Link to="/">
                    <ListItem button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary="Page d'acceuil"/>
                    </ListItem>
                </Link>
                <Link to="/listData">
                    <ListItem button>
                        <ListItemIcon><ListIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary="Voir les articles"/>
                    </ListItem>
                </Link>
                <Link to="/listData/create">
                    <ListItem button>
                        <ListItemIcon><CreateIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary="Creer un article"/>
                    </ListItem>
                </Link>

                <Link to="/listMessages">
                    <ListItem button>
                        <ListItemIcon><CreateIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary={`Voir les messages (${numberNewMessages})`}/>
                    </ListItem>
                </Link>
                <Divider/>
                <ListItem button onClick={() => app.auth().signOut()}>
                    <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                    <ListItemText primary="Se Déconnecter"/>
                </ListItem>
            </List>
        </div>
    );

    return (
        <SidePanelContainer>
            <Button variant="outlined" onClick={toggleDrawer(true)}><MenuIcon/></Button>
            <TitleSidePanel> Location Pattaya</TitleSidePanel>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {sideList()}
            </Drawer>
        </SidePanelContainer>
    );
};

const SidePanelContainer = styled.div `
        background-color: ${props => props.theme.color.primary};
        color: ${props => props.theme.color.secondary};
        display: flex;
        padding: 15px 10px;
        margin-bottom: 30px;
        justify-content: space-between;
    `;

const TitleSidePanel = styled.h2 `
        font-family: ${props => props.theme.font.title}, sans-serif;
        margin: 0;  
        padding-right: 5px;  
    `
export default SidePanel;
