import React from "react"
import {Container} from "@material-ui/core";
import SidePanel from "../SidePanel/SidePanel";
import Footer from "../SidePanel/Footer";

const Home = () => {
    return (
        <>
            <SidePanel/>
            <Container fixed>

                <h1>from component home</h1>
            </Container>
            <Footer/>
        </>
    )
};

export default Home
