import React, { Component } from 'react';
import {
  Router,
  Route
} from 'react-router-dom';

import { Url, Components } from 'fun-plus';

import Home from './pages/home';

const { History } = Url;
const { RouterListener } = Components;

export default class RouterList extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  routeChange = () => {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Router basename="/page" history={History}>
        <RouterListener onChange={this.routeChange}>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
        </RouterListener>
      </Router>
    )
  }
}
