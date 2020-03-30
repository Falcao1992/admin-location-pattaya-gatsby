import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import './App.css';
import Home from "./components/Home/Home";
import ListData from "./components/ListData/ListData";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/listData" component={ListData}/>
            </Switch>
        </Router>
    );
}

export default App;
