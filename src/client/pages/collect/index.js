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
        {/* <div className="collect-header">
          添加合约商品
        </div> */}
        <Header>添加合约商品</Header>
        {/* <div className="collect-body">
          <span>空间类型<input type="text" className="name" placeholder="选择空间类型"></input><br /></span>
          <span>空间内容<input type="text" className="old" placeholder="请输入空间名称"></input><br /></span>

        </div> */}
      </div>
    );
  }
}
