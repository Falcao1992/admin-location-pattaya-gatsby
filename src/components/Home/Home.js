import React, {useEffect, useState} from "react"

import SidePanel from "../SidePanel/SidePanel";
import Footer from "../SidePanel/Footer";
import app from "../../firebase";
import styled from "styled-components";
const Home = () => {
    const [dataImages, setDataImage] = useState([]);

    useEffect(() => {
        const fetchDataImage = async () => {
            try {
                const flattenArray = (obj, parents = []) => {
                    if (typeof obj !== 'object') {
                        return []
                    }
                    return Object.entries(obj)
                        .flatMap(([currentItemName, value]) => {
                            if (typeof value !== 'object' && currentItemName === "urlImage") {
                                console.log(obj)
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
                dataFlat.sort(function(a,b){
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.date) - new Date(a.date);
                });
                const dataFormat = dataFlat.slice(0, 12);
                setDataImage(dataFormat)
            } catch (e) {
                console.error(e)
            }
        };
        fetchDataImage()

    }, []);
    return (
        <>
            <SidePanel/>
            <h1>gestion du site</h1>
            <div>
                <h2>voir me articles</h2>
                <WrapperGrid>
                {dataImages.length !== 0 && dataImages.map(image => {
                    return (
                        <ContainerImageGrid key={image.name}>
                            <img src={image.urlImage} alt={image.name}/>
                        </ContainerImageGrid>
                    )
                })}
                </WrapperGrid>
            </div>
            <Footer/>
        </>
    )
};

const WrapperGrid = styled.div`
        border: ${props => props.theme.color.secondary} 1px solid;
        display: grid;
        grid-template-columns: repeat(4, auto);
        grid-gap: 1px;
        margin: auto;
        width: 80%; 
        padding: 1px;
        `;

const ContainerImageGrid = styled.div`
        img{          
            object-fit: cover;
            width: 100%;
            height: 100%;
            
        }
  `;

export default Home
