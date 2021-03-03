import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Profile from './components/Profile';

import Dashboard from './components/Dashboard'


import Login from './components/Login';
import ManageTimeTable from './components/ManageTimeTable';
import Registration from './components/Registration';
import ManageBusRoute from './components/ManageBusRoute';
import Homepage from './components/Homepage'
import MapView from './components/MapView';
import Chat from './components/Chat';

function App() {

  return (
    <>
      <Router>
      
        
        <Switch>
        
          <Route path='/' exact component={Homepage} />
          <Route path='/Login' component={Login} />
          <Route path='/MapView' component={MapView} />
          <Route path='/Dashboard' component={Dashboard} />
          <Route path='/Registration' component={Registration} />
          <Route path='/ManageTimeTable' component={ManageTimeTable} />
          <Route path='/ManageBusRoute' component={ManageBusRoute} />
          <Route path='/Chat' component={Chat} />

         
          <Route path='/Profile' component={Profile} />
         
          
        </Switch>


        
      </Router>
    </>
  );
}

export default App;

