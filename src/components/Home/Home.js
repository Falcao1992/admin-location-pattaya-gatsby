import React from "react"
import {Container} from "@material-ui/core";
import SidePanel from "../SidePanel/SidePanel";

const Home = () => {
    return(
        <Container fixed>
            <SidePanel/>
            <h1>from component home</h1>
        </Container>
    )
};

export default Home
