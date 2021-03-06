import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import './App.css';
import Home from "./components/Home/Home";
import ListData from "./components/ListData/ListData";
import NoMatch from "./components/NoMatch";
import PrivateRoute from "./components/PrivateRoute";
import {AuthProvider} from "./components/Auth";
import Login from "./components/Login/Login";
import ListDataEdit from "./components/ListData/ListDataEdit";
import ListDataCreate from "./components/ListData/ListDataCreate";
import ListMessages from "./components/ListMessages/ListMessages";
import ListOneMessage from "./components/ListMessages/ListOneMessage";

import theme from "./assets/theme";
import {ThemeProvider} from "styled-components";
import ListBanner from "./components/Banner/ListBanner";

function App() {
    return (
        <ThemeProvider theme={theme}>
        <AuthProvider>
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/" component={Home}/>
                    <PrivateRoute exact path="/listData" component={ListData}/>
                    <PrivateRoute exact path="/listData/create" component={ListDataCreate}/>
                    <PrivateRoute exact path="/listData/edit/:articleName" component={ListDataEdit}/>
                    <PrivateRoute exact path="/listMessages" component={ListMessages}/>
                    <PrivateRoute exact path="/listOneMessages/:keyMessage" component={ListOneMessage}/>
                    <Route exact path="/banner" component={ListBanner}/>
                    <Route component={NoMatch}/>
                </Switch>
            </Router>
        </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
