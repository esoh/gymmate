import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch, Redirect } from "react-router-dom";

import './App.css';
import Navbar from './common/Navbar';
import Home from './home/Home';
import Programs from './programs/Programs';
import Exercises from './exercises/Exercises';
import Profile from './profile/Profile';
import ModalProvider from './common/ModalProvider';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <ModalProvider>
                        <Navbar expand="md"/>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/programs" component={Programs}/>
                            <Route path="/exercises" component={Exercises}/>
                            <Route path="/profile" component={Profile}/>
                            <Route path="*" render={() => <Redirect to="/"/>}/>
                        </Switch>
                    </ModalProvider>
                </Router>
            </div>
        );
    }
}

export default App;
