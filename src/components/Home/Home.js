import React, {useEffect, useState} from "react"

import SidePanel from "../SidePanel/SidePanel";
import Footer from "../SidePanel/Footer";
import app from "../../firebase";
import styled from "styled-components";
import {CircularLoadingContainer, CircularLoading} from "../StyledComponents/Loader";
import {Container} from "@material-ui/core";

const Home = ({history}) => {
    const [dataImages, setDataImage] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDataImage = async () => {
            try {
                setIsLoading(true);
                const flattenArray = (obj, parents = []) => {
                    if (typeof obj !== 'object') {
                        return []
                    }
                    return Object.entries(obj)
                        .flatMap(([currentItemName, value]) => {
                            if (typeof value !== 'object' && currentItemName === "urlImage") {
                                return [
                                    obj
                                ]
                            }
                            return flattenArray(value, parents.concat(currentItemName))
                        })
                };
                const dbRef = app.database().ref("/pagesPicturesData");
                const snapshot = await dbRef.once("value");
                const dataFlat = flattenArray((snapshot.val()))
                dataFlat.sort(function (a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.date) - new Date(a.date);
                });
                const dataFormat = dataFlat.slice(0, 12);
                setDataImage(dataFormat)
                setIsLoading(false);
            } catch (e) {
                console.error(e)
            }
        };
        fetchDataImage()

    }, []);

    const handleLinkToArticle = (img) => {
        localStorage.setItem("article choose", img.name);
        localStorage.setItem("page choose", img.page);
        history.push("/listData");
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
            <SectionHomeCreate>
                <TitleSection>Voir mes articles :</TitleSection>
                    <WrapperGrid>
                        {dataImages.length !== 0 && dataImages.map(image => {
                            return (
                                <ContainerImageGrid key={image.name} onClick={() => handleLinkToArticle(image)} >
                                    <img src={image.urlImage} alt={image.name}/>
                                </ContainerImageGrid>
                            )
                        })}
                    </WrapperGrid>
            </SectionHomeCreate>
            </Container>
            <Footer/>
        </>
    )
};

const TitleSection = styled.h2`
        font-family: ${props => props.theme.font.title}, sans-serif;
        padding: 15px 0;
        font-size: 1.7em;     

    `;
const SectionHomeCreate = styled.section`
        display: flex;
        flex-direction: column;      
        align-items: center;
    `;
const WrapperGrid = styled.div`
        border: ${props => props.theme.color.secondary} 2px solid;
        display: grid;
        grid-template-columns: repeat(4, auto);
        grid-gap: 2px;
        margin: auto;
        width: 60%; 
        padding: 1px;
        `;

const ContainerImageGrid = styled.div`
        img{          
            object-fit: cover;
            width: 100%;
            height: 100%;
            vertical-align: middle;        
        }
  `;

export default Home
