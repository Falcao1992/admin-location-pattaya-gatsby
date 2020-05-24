import React, {useEffect, useState} from "react";
import SidePanel from "../SidePanel/SidePanel";
import Footer from "../SidePanel/Footer";
import app from "../../firebase";
import {CircularLoading, CircularLoadingContainer} from "../StyledComponents/Loader";
import styled from "styled-components";
import {Container, Input, CardMedia, Button} from "@material-ui/core";


const ListBanner = () => {

    const [isLoading, setIsLoading] = useState(true);

    const [firebaseDataBanner, setFirebaseDataBanner] = useState([]);

    const [currentBannerImg, setCurrentBannerImg] = useState([]);
    const [currentImageFile, setCurrentImageFile] = useState([]);


    useEffect(() => {
        fetchDataBanner()
    }, []);

    const fetchDataBanner = async () => {
        try {
            setIsLoading(true);
            const dbRef = app.database().ref("/banner");
            const snapshot = await dbRef.once("value");
            const value = snapshot.val();
            setFirebaseDataBanner(value);

            setIsLoading(false);
        } catch (e) {
            console.error(e)
        }
    };

    const PreviewFile = (e,index) => {
        try {
            const file = e.target.files[0];

            const resultFile = [...currentImageFile];
            resultFile[index] = file;
            setCurrentImageFile(resultFile);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (event) => {
                const result = [...currentBannerImg];
                result[index] = event.target.result;
                setCurrentBannerImg(result);
            };

        } catch (error) {
            console.error(error)
        }
    };

    const submitEditBanner = (index, pageName) => {
        console.log(currentImageFile[index])
        if(currentImageFile[index] !== undefined) {
            console.log("c'est bon")
            sendData(currentImageFile[index], pageName)
        } else {
            console.log("pas de fichier")
        }
    };

    const sendData = (file, pageName) => {
        const uploadTask = app.storage().ref(`banner/${pageName}Banner`).put(file);
        uploadTask.on(`state_changed`,
            (snapshot) => {
                console.log(snapshot)
            },
            (error) => {
                console.log(error)
            },
            () => {
                app.storage().ref(`banner`).child(`${pageName}Banner`).getDownloadURL()
                    .then(url => {
                        return url
                    })
                    .then((bannerUrl) => {
                        console.log(bannerUrl);
                        app.database().ref(`banner/${pageName}`)
                            .update({
                                urlImage: bannerUrl
                            });
                        fetchDataBanner()
                    })
                    .catch(e => {
                        console.error(e)
                    })
            });
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
                {firebaseDataBanner && Object.values(firebaseDataBanner).map((banner, index) => {
                    return (
                        <ContainerBanner key={banner.uid}>
                            <div>
                                <p>{banner.page}</p>
                                <img src={banner.urlImage} alt={banner.page}/>

                            </div>
                            <div>
                                <Input type="file" margin='dense' required onChange={(e) => PreviewFile(e,index)}/>
                                {typeof currentBannerImg[index] === 'string'
                                    &&
                                    <CardMedia title="Image de l'article" alt="article">
                                        <img src={currentBannerImg[index]} alt="article"/>
                                    </CardMedia>}
                            </div>
                            <div>
                                <Button variant="contained" type="button" onClick={() => submitEditBanner(index, banner.page)} color="primary"
                                              aria-label="edit">create</Button>
                            </div>
                        </ContainerBanner>
                    )
                })}
            </Container>
            <Footer/>
        </>
    )
};

const ContainerBanner = styled.div`
    width: 100%;
    display: flex;
    img {
        width: 100%;
    }
`;

export default ListBanner
