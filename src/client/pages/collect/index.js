import React, { Component } from 'react';

import { Components } from 'fun-plus';
// import FunPicker from '../../components/fun-picker';

import './style.scss';

const { Header } = Components;

export default class Collect extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };

  }

  componentWillMount() {

  }

  render() {
    return (
      <div className="collect-page">
        <Header>添加合约商品</Header>
      </div>
    );
  }
}
