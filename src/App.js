import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import './App.css';
import Home from "./components/Home/Home";
import ListData from "./components/ListData/ListData";
import NoMatch from "./components/NoMatch";
import PrivateRoute from "./components/PrivateRoute";
import {AuthProvider} from "./components/Auth";
import Login from "./components/Login/Login";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/" component={Home}/>
                    <PrivateRoute exact path="/listData" component={ListData}/>
                    <Route component={NoMatch}/>
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
