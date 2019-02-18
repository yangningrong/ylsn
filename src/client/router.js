import React,{ Component } from 'react';
import {
    Router,
    Route
} from 'react-router-dom';

import RouterListener from './components/router-listener';
import History from './common/url/history';

import Home from './pages/home';

export default class RouterList extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  routeChange = () => {
    window.scrollTo(0,0);
  }

  render(){
    return (
      <Router history={History}>
        <RouterListener onChange={this.routeChange}>
          <Route exact path="/" component={Home}/>
          <Route exact path="/home" component={Home}/>
        </RouterListener>
      </Router>
    )
  }
}
