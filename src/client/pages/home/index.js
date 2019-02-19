import React, { Component } from 'react';

import Collect from '../collect/index';
import './style.scss';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };

  }

  componentWillMount() {

  }

  render() {
    return (
      <div className="home-page">
        {/* hello world */}
        <Collect></Collect>
      </div>
    );
  }
}
