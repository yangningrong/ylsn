import React from 'react';
import { Components, Store, Platform } from 'fun-plus';
import FunPicker from '../../../components/fun-picker';
import SelectBox from '../../../components/select-box';
import { Toast } from 'fun-plus/lib/components';
import Pages from '../../../common/config/pages';
import Header from '../../../components/header';
import classNames from "classnames";
import nativeStore from '../../../common/nativeStore';

import model from './model';
import './style.scss';

const { BasePage, Layout, Icon } = Components;
const { LocalStore } = Store;

export default class customerdetail extends BasePage {
  constructor(props) {
    super(props);

    this.state = {
      noHeaderBar: Platform.isFun, //是否在客户端
      uid: '', //客户id
      datalists: {},
      guideOrdersData: [],
      callBackOrdersData: [],
      CustomOrderCloseReasonData: [],
      ChannelArrData: [],
      rightText: '',
    };
    this.query = this.getQuery();

    this.closeReasonRef = React.createRef();

    ['onWebViewAppear'].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  onWebViewAppear() {
    this.onLoad()
  }

  // 获取详情
  getCustomerDetailData = () => {
    const { uid } = this.state;
    model.getCustomerDetail({ id: uid }).then(res => {
      delete res._response_;
      this.setState({
        datalists: res,
        guideOrdersData: res.guideOrders,
        callBackOrdersData: res.callBackOrders,
        rightText: res.status == 0 ? '关闭客户单' : res.status == 2 ? '开启客户单' : '',   // status (0, "未签约"),   (1, "已签约"),  (2, "已关闭");
      })
      this.persistence(JSON.stringify(res), { key: "customerInfo" })
    })
      .catch((error) => {
        if (error.data && error.data.data && error.data.data.message) {
          this.showToast(error.data.data.message)
        }
      })
  }

  onLoad = () => {
    const { CustomOrderCloseReasonData = [] } = this.state;
    LocalStore.remove('birthdayDisplay');
    LocalStore.remove('birthdayDisplay1');
    LocalStore.remove('birthdayProp');
    LocalStore.remove('birthdayProp1');
    LocalStore.remove('info');
    if (Platform.isFun) {
      nativeStore.remove('productList');
      LocalStore.remove('productList');
    } else {
      LocalStore.remove('productList');
    }
    this.setState({
      uid: this.query.uid
    }, () => {
      this.getCustomerDetailData();
    })
    model.getDiclist({}).then(res => {
      this.setState({
        ChannelArrData: res.ZhiKeChannel.concat(res.FEIZhiKeChannel)
      })
      res.CustomOrderCloseReason.map((item, index) => {
        CustomOrderCloseReasonData.push({
          value: item.id,
          label: item.name
        })
      })
    })
      .catch((error) => {
        if (error.data && error.data.data && error.data.data.message) {
          this.showToast(error.data.data.message)
        }
      })
  }

  componentWillMount() {
    this.onLoad()
  }

  // 建立合约
  gotoContract = (parms) => {
    const { datalists = {} } = this.state;
    const parmsData = {
      guideId: parms.id,
      projectId: parms.relatedProjectId,
      contacter: datalists.name,
      contacterPhone: datalists.mobile,
      salesman: datalists.salesman,//招商人员姓名
      broker: datalists.broker, //经纪人姓名
      gender: datalists.gender,
      organizationName: datalists.organizationName,//机构名称
      relatedProjectName: parms.relatedProjectName,//所属项目名称
      industryId: datalists.industryId,//所属行业ID
      member: datalists.member,//是否已有会籍
      channelTypeId: datalists.channelTypeId,//渠道类型Id
      channelId: datalists.channelId,//渠道id
      channelName: datalists.channelName,//渠道名称
      organizationType: datalists.organizationType,//企业  非企业
      channelType: datalists.channelType,
    }
    LocalStore.set('info', JSON.stringify(parmsData))
    this.jump(Pages['CONTRACT']);
  }

  // 关闭客户单--原因
  onChangePro(value, data) {
    const { uid } = this.state;
    model.closeCustomerReason({
      id: uid,
      closeReasonId: value
    }).then(res => {
      this.closeReasonRef.current.setValue(value, true);
      this.getCustomerDetailData();
    })
      .catch((error) => {
        if (error.data && error.data.data && error.data.data.message) {
          this.showToast(error.data.data.message)
        }
      })
  }

  // 开启客户单
  openCustomer = () => {
    const { uid } = this.state;
    model.openCustomerReason({ id: uid }).then(res => {
      this.getCustomerDetailData();
    })
      .catch((error) => {
        if (error.data && error.data.data && error.data.data.message) {
          this.showToast(error.data.data.message)
        }
      })
  }

  // 调电话号码
  phone = (phonenum) => {
    if (phonenum) {
      window.location.href = 'tel:' + phonenum;
    } else {
      this.showToast('请先录入手机号码');
    }
  }

  render() {
    const { uid, noHeaderBar, rightText, datalists = {}, guideOrdersData = [], callBackOrdersData = [], CustomOrderCloseReasonData = [] } = this.state;
    const _this = this;
    return (<Layout className="customer-detail-page">
      <div className={classNames("page-headerbar", noHeaderBar ? 'no-header-bat' : '')}>
        <Header className='customer-header' showLine={false} data={
          {
            title: '客户信息',
            right: [{
              text: rightText,
              icon: '',
              callback: function () {
                if (_this.state.datalists && _this.state.datalists.status == 0) {   // status (0, "未签约"),   (1, "已签约"),  (2, "已关闭");
                  _this.closeReasonRef.current.show();
                } else if (_this.state.datalists && _this.state.datalists.status == 2) {
                  _this.openCustomer();
                }
              }
            }
            ]
          }} />
        <FunPicker onChange={this.onChangePro.bind(this)} ref={this.closeReasonRef} title="关闭原因" data={[{ options: CustomOrderCloseReasonData }]}>
          <SelectBox required label="" />
        </FunPicker>
      </div>
      {Object.keys(datalists).length > 0 && <div className='customer-detail'>
        <div className="detail-item">
          <div className="item-top line-bottom">
            {datalists.status == 2 ? <div className="item-top-closereason">
              <span className="item-top-closereason-span">客户单关闭原因：{datalists.closeReason}</span>
              <span className="item-top-closebtn">已关闭</span>
            </div> : null}
            <div className="item-top-name">
              {datalists.customerType == 1 ?
                <a className="item-top-btn" href="javascript:void(0)" onClick={() => this.phone(datalists.mobile)}><Icon icon="phone" />
                  &nbsp;联系客户
                </a> :
                <a className="item-top-btn" href="javascript:void(0)" onClick={() => this.phone(datalists.brokerPhone)}><Icon icon="phone" />
                  &nbsp;联系中介
                </a>
              }
              <p className="item-name">
                <span className="name name-width">{datalists.name.length > 8 ? `${datalists.name.slice(0, 6)}...` : datalists.name}</span>
                <em className={classNames('line-right', datalists.gender == 0 ? 'gender' : 'gender-women')}>
                  {datalists.gender == 0 ? <Icon icon="men" /> : <Icon icon="women" />}
                </em>
                <span className="star">
                  <span className="star-five">
                    {[...Array(datalists.intentionValue).keys()].concat([...Array(5 - datalists.intentionValue)]).map((val, _ind) => {
                      if (val || val == '0') {
                        return (<Icon icon="star-full" key={_ind} />)
                      } else {
                        return (<Icon icon="start-empty-bold" key={_ind} />)
                      }
                    })}
                  </span>
                </span>
              </p>
            </div>
            <p className="item-date item-data-p">
              {(() => {
                switch (datalists.status) {
                  case 0: return <span className="item-tag item-tag-r">未签约</span>; break;
                  case 1: return <span className="item-tag item-tag-o">已签约</span>; break;
                  case 2: return <span className="item-tag item-tag-p">已关闭</span>; break;
                }
              })()}
            </p>
            <p className="item-date item-date-b">
              <span>[{datalists.organizationType}]&nbsp;</span>
              {datalists.organizationName}</p>
            <p className="item-address">
              <span>项目：</span>
              <span className="item-pro-name">{datalists.relatedProjectName}</span>
            </p>
            <p className="item-date">
              <span>意向：{datalists.requiredType}&nbsp;|</span>
              {/* {(() => {
                switch (datalists.requiredTypeId) {
                  case 20: return <span>工位&nbsp;|</span>; break;
                  case 21: return <span>房间&nbsp;|</span>; break;
                  case 22: return <span>房间工位&nbsp;|</span>; break;
                  case 23: return <span>传统办公&nbsp;|</span>; break;
                }
              }
              )()} */}
              &nbsp;<span>{datalists.stationNumber || '--'}工位&nbsp;|</span>
              &nbsp;<span>{datalists.enterMonthName || '-'}{datalists.enterPeriodName || '-'}入驻&nbsp;|</span>
              &nbsp;{datalists.budget && datalists.budget > 0 ? <span>{datalists.budget}/月工位</span> : <span>无预算</span>}
            </p>
            {datalists.customerType == 0 ? <p className="item-date item-data-channel">渠道：{datalists.channelType}{datalists.channelName ? ` | ${datalists.channelName}` : ''} {datalists.broker ? ` | ${datalists.broker}` : ''}</p> : ''}
            <div className="item-data-bottombtn">
              <a className="item-data-bottom-btn halfpx" onClick={() => { this.jump(Pages['EDITORCUSTOMER'], { uid: `${uid}` }) }}>
                <Icon icon="qianke-xiugai" className="icon-qianke-xiugai" />
                <span className="item-data-bottom-btn-text">修改信息</span>
              </a>
              <a className="item-data-bottom-btn halfpx" onClick={() => { this.jump(Pages['CHANNELADD'], { uid: `${uid}` }) }}>
                <Icon icon="qianke-biaodan" className="icon-qianke-xiugai" />
                <span className="item-data-bottom-btn-text">+带看计划</span>
              </a>
              <a className="item-data-bottom-btn halfpx" onClick={() => { this.jump(Pages['ADDTELINTERVIEW'], { uid: `${uid}` }) }}>
                <Icon icon="qianke-tel" className="icon-qianke-xiugai" />
                <span className="item-data-bottom-btn-text">+电访计划</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      }
      {/*** 项目列表 ***/}
      <ul className='order-list'>
        {guideOrdersData && guideOrdersData.map((value, index) => {
          return (
            <li className="list-item" onClick={e => { e.target.tagName !== 'A' && this.jump(Pages['CHANNELDETAIL'], { uid: `${uid}`, id: `${value.id}` }) }}>
              <div className="item-top line-bottom">
                {/* status :1  已取消   2  已关闭   0  已安排   contractStatus：0 为建立合约  1  已建立合约 */}
                {value.contractStatus == 1 ? <a className="item-top-btn item-top-btn-noborder">已建立合约</a> : (
                  value.status == 1 ? "" : <a className="item-top-btn item-top-btn-border" onClick={() => this.gotoContract(value)}>建立合约</a>
                )}
                <p className="item-name">
                  <span className="name">{value.relatedProjectName}</span>
                </p>
                <p className="item-date item-data-p">
                  {(() => {
                    switch (value.status) {
                      case 1: return <span className="item-tag item-tag-g">已取消</span>; break;
                      case 2: return <span className="item-tag item-tag-p">已关闭</span>; break;
                      default: return <span className="item-tag item-tag-o">已安排</span>;
                    }
                  })()}
                </p>
                <p className="item-address">带看时间：{value.guideDateStr} {value.guideTime}</p>
                <p className="item-address">
                  <span>带看重点：</span>
                  <span>
                    {(() => {
                      switch (value.requiredTypeId) {
                        case 20: return <span>工位&nbsp;|</span>; break;
                        case 21: return <span>房间&nbsp;|</span>; break;
                        case 22: return <span>房间工位&nbsp;|</span>; break;
                        case 23: return <span>传统办公&nbsp;|</span>; break;
                      }
                    })()}
                  </span>
                  <span>{value.stationNumber}工位</span>
                </p>
                {value.brokerAccompany == 1 ? <p className="item-together">经纪人陪同</p> : null}
              </div>
              {value.resultName ? <div className="item-bottom">关闭：{value.resultName}</div> : <div className="item-bottom">暂无带看结果</div>}
              <div className="green-bar item-bar"></div>
            </li>
          )
        })}
        {callBackOrdersData && callBackOrdersData.map((value, index) => {
          return (
            <li className="list-item" onClick={() => { this.jump(Pages['TELINTERVIEWDETAIL'], { uid: this.query.uid, id: `${value.id}` }) }}>
              <div className="item-top line-bottom">
                <p className="item-name item-name-overflow">
                  <span className="name">{value.callbackPointStr}</span>
                </p>
                <p className="item-date item-data-p">
                  {(() => {
                    switch (value.status) {
                      case "已安排": return <span className="item-tag item-tag-o">已安排</span>; break;
                      case "已取消": return <span className="item-tag item-tag-g">已取消</span>; break;
                      case "已关闭": return <span className="item-tag item-tag-p">已关闭</span>; break;
                    }
                  })()}
                </p>
                <p className="item-address">电访时间：{value.callbackDateStr}&nbsp;{value.callbackTimeStr}</p>
              </div>
              {value.result ? <div className="item-bottom">关闭：{value.resultStr}</div> : <div className="item-bottom">暂无电访结果</div>}
              <div className="red-bar item-bar"></div>
            </li>
          )
        })}
      </ul>
      <div className="iphonex-bottom"></div>
    </Layout >)
  }
} 