import React, {useState} from 'react';
import {Link} from "react-router-dom";

// Import Components of Material-Ui
import {Drawer, Button, List, Divider, ListItem, ListItemText} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PeopleIcon from '@material-ui/icons/People';
import HomeIcon from '@material-ui/icons/Home';
import app from "../../firebase";
import {makeStyles, Container} from '@material-ui/core';
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
                        <ListItemText className={classes.listItem} primary="Home"/>
                    </ListItem>
                </Link>
                <Link to="/listData">
                    <ListItem button>
                        <ListItemIcon><PeopleIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary="List Data"/>
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
        <Container fixed className="button_sidePanel">
            <Button variant="outlined" color="primary" onClick={toggleDrawer(true)}>Open Menu</Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {sideList()}
            </Drawer>
        </Container>
    );
};

export default SidePanel;
