import React, { Component } from 'react';

import { Components } from 'fun-plus';
// import FunPicker from '../../components/fun-picker';

import './style.scss';
import { Layout } from 'fun-plus/lib/components';

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
      <Layout className="collect-page">

        {/* Header 区域 */}
        <Header className="collect-header">
          添加合约商品
          </Header>


        {/* Body区域 */}
        <Selection className="collect-body">

          <div className="collect-input"></div>
        </Selection>
      </Layout>



    )
  }
}
