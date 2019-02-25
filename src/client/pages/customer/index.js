import React, { Component } from 'react';

import { Components } from 'fun-plus';

import './style.scss';


const { BasePage, Layout, Header } = Components;

export default class Customer extends BasePage {
  constructor(props) {
    super(props);

    this.state = {

    };

  }

  componentWillMount() {

  }

  render() {
    return (
      <Layout className="customer-page">
        {/* header区域 */}
        <Header className="customer-header">
          用户管理
        </Header>
        customer
      </Layout>
    );
  }
}
