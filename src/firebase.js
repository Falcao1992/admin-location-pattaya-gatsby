import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import '@firebase/storage';

const app = firebase.initializeApp({
    apiKey: "AIzaSyCOj-sa7CxJHpuLFpg8-YThcNqvjvjnsAE",
    authDomain: "location-pattaya.firebaseapp.com",
    databaseURL: "https://location-pattaya.firebaseio.com",
    projectId: "location-pattaya",
    storageBucket: "location-pattaya.appspot.com",
    messagingSenderId: "1040793840778",
    appId: "1:1040793840778:web:b891bb1b7642cde7c29173"
});

export default app;
