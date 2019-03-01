import React from 'react';
import CustomerFilters from './filter'

import { Components } from 'fun-plus';
import { withRouter } from "react-router-dom";

import model from './model';

import './style.scss';
import classNames from 'classnames';
import Pages from '../../common/config/pages';
// import customer from '../customer';

const { BasePage, Layout, Header, Icon, TextInput, ScrollLoad } = Components;

const filters = [[3, 0, 1, 2], [2, 1, 0], [0, 1, 2, 3]];

class customer extends BasePage {
  constructor(props) {
    super(props);

    this.state = {
      customerList: [],
      isReady: true,
    };

    this.model = {
      queryData: {
        pageNumber: 1,
        pageSize: 20,
        signStatus: 3,
        guideStatus: 2,
        orderType: 0,
      },
    }

  };

  loadList = (searchText) => {
    const { queryData } = this.model;
    model.getList({ name: searchText, ...queryData }).then(({ customerList, total }) => {
      this.model.searchText = searchText;
      this.setState({ customerList, total, isReady: false })
    }).catch((error) => {
      if (error.data && error.data.data && error.data.data.message) {
        this.showToast(error.data.data.message)
      }
    })
  }

  componentWillMount() {
    this.loadList('')
  }
  filterTitles = ['客户状态', '带看状态', '排序']

  filterContents = [
    [{ displayText: '全部' }, { displayText: '未签约' }, { displayText: '已签约' }, { displayText: '已关闭' }],
    [{ displayText: '全部' }, { displayText: '无计划' }, { displayText: '已安排' }],
    [{ displayText: '修改时间倒序' }, { displayText: '修改时间正序' }, { displayText: '客户意向高到低' }, { displayText: '客户意向低到高' }]
  ]

  onTitleChange = (index) => {
    if (this.state.index !== index) {
      this.setState({ index: index });
    } else {
      this.setState({ index: -1 });
    }
  }



  // 筛选器:
  onListClick = (indexNew) => {
    const { index, contentIndex } = this.state;
    if (contentIndex[index] !== indexNew) {
      contentIndex[this.state.index] = indexNew;
      const queryData = {
        pageNumber: 1,
        pageSize: 20,
        signStatus: filters[0][contentIndex[0]],
        guideStatus: filters[1][contentIndex[1]],
        orderType: filters[2][contentIndex[2]],
      }
      this.model.searchText = '';
      this.model.queryData = queryData;
      model.getList(queryData).then(({ customerList, total }) => {
        this.setState({ isReady: false, contentIndex: contentIndex, index: -1, customerList, total });
      }).catch((error) => {
        if (error.data && error.data.data && error.data.data.message) {
          this.showToast(error.data.data.message)
        }
      })
    } else {
      this.setState({ index: -1 });
    }
  }


  render() {
    const { customerList, isReady } = this.state;

    return (
      <Layout className="customer-page">
        {/* header区域 */}
        <div className="page-headerbar">
          <div className="customer-header">
            <Header showLine={false}>
              <Header.Left></Header.Left>
              <Header.Center>客户管理</Header.Center>
              <Header.Right><Icon icon="add-friend" />新增客户</Header.Right>
            </Header>

            <div className="customer-search">
              <span className="search-bar-cancle-btn">搜索</span>
              <TextInput placeholder="请输入客户姓名搜索" icon="search" />
            </div>

            <CustomerFilters
              titles={this.filterTitles}
              contents={this.filterContents}
              index={this.state.index}
              contentIndex={this.state.contentIndex}
              onTitleChange={(index) => this.onTitleChange(index)}
              onListClick={(index) => this.onListClick(index)}
            />
          </div>
        </div>

        {customerList.length === 0 ? (<p className="list-null">{isReady ? '正在加载' : '查询不到相关的客户'}</p>) :
          (<ul className='customer-list'>
            {customerList.map(item => (
              <li key={item.id} className="list-item" onClick={e => { e.target.tagName !== 'A' && this.jump(Pages['CUSTOMERDETAIL'], { uid: `${item.id}` }) }}>
                <div className="item-top line-bottom">
                  {item.customerType == 0 ? <a className="item-top-btn" href="javascript:void(0)" onClick={() => this.phone(item.brokerPhone)}><Icon icon="phone" /> &nbsp;联系中介</a> : <a className="item-top-btn" href="javascript:void(0)" onClick={() => this.phone(item.mobile)}><Icon icon="phone" />&nbsp;联系客户</a>}
                  <p className="item-name">
                    <span className="name">{item.name.length > 8 ? `${item.name.slice(0, 6)}...` : item.name} </span>
                    <em className={classNames("gender line-right", item.gender == 1 ? "gender-women" : "gender-men")}><Icon icon={item.gender == 1 ? "women" : "men"} /></em>
                    <span className="star">
                      <span className="star-five">
                        {
                          [...Array(item.intentionValue).keys()].concat([...Array(5 - item.intentionValue)]).map((val, _ind) => {
                            if (val || val == '0') {
                              return (<Icon icon="star-full" key={_ind} />)
                            } else {
                              return (<Icon
                                icon="start-empty-bold" key={_ind}
                              />)
                            }
                          })
                        }
                      </span>
                    </span>
                  </p>
                  <p className="item-date item-data-p">
                    <span className={classNames('item-tag', { 0: 'item-tag-r', 1: 'item-tag-o', 2: 'item-tag-p' }[item.status])}>{{ 0: '未签约', 1: '已签约', 2: '已关闭' }[item.status]}
                    </span>
                  </p>
                  <p className="item-date item-date-b">[{item.organizationType}]{item.organizationName}</p>
                  <p className="item-address">项目:{item.relatedProjectName}</p>
                  <p className="item-date">意向:意向：{item.requiredType} | {item.stationNumber || '--'} 工位 | {item.enterMonthName || '-'}{item.enterPeriodName || '-'} 入驻 | {item.budget ? `${item.budget}/月工位` : '无预算'}</p>
                  <p className="item-together" style={{ display: item.customerType == 0 ? 'block' : 'none' }}>渠道：{item.channelType}{item.channelName ? ` | ${item.channelName}` : ''} {item.broker ? ` | ${item.broker}` : ''}</p>
                </div>
                <div className="item-bottom">
                  <div className="item-bottom-data">
                    <Icon className="item-bottom-data-icon" icon="qianke-tel" />
                    <span className="item-bottom-data-label">电访计划</span>
                    <span className={classNames("item-bottom-data-value", item.phonePlanDate ? "" : "item-bottom-data-value-r")}>{item.phonePlanDate ? item.phonePlanDate : '暂无计划'}</span>
                  </div>
                  <div className="item-bottom-data">
                    <Icon className="item-bottom-data-icon" icon="qianke-biaodan" />
                    <span className="item-bottom-data-label">带看计划</span>
                    <span className={classNames("item-bottom-data-value", item.lookPlanDate ? "" : "item-bottom-data-value-r")}>
                      {item.lookPlanDate ? item.lookPlanDate : '暂无计划'}</span>
                  </div>
                </div>

              </li>

            ))}
          </ul>)}


        {/* <ScrollLoad onLoad={this.onLoad} />
        <div className='customer-page-layer' onClick={() => { this.setState({ index: -1 }) }} style={{ display: this.state.index != -1 ? 'block' : 'none' }}></div> */}
      </Layout>
    );
  }
}
export default withRouter(customer);