import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Components } from 'fun-plus';

import './style.scss';

const { Icon } = Components;

export default class CustomerFilters extends Component {
  static propTypes = {
    //容器class
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    //titles
    titles: PropTypes.array,
    //默认选择tab
    index: PropTypes.number,
    //内容区样式
    contentClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    //内容数据
    contents: PropTypes.array,
    //内容列表选中项目, number array
    contentIndex: PropTypes.array,
    //title改变后的回调
    onTitleChange: PropTypes.func,
    //内容列表点击回调
    onListClick: PropTypes.func,
  };

  static defaultProps = {
    titles: [],
    Index: -1,
    contentIndex: [],
    contents: []
  };

  constructor(props) {
    super(props);
  }

  titleClick = (index) => {
    this.props.onTitleChange && this.props.onTitleChange(index);
  }

  titleClass = (index) => {
    return index === this.props.index ? (index === 2 ? '' : 'active') : (this.props.contentIndex[index] > 0 ? 'has-value' : '');
  }

  titleContent = (index) => {
    let optionIndex = this.props.contentIndex[index];
    return optionIndex > 0 ? this.props.contents[index][optionIndex].displayText : this.props.titles[index];
  }

  contentClass = (index) => {
    return index === this.props.index ? 'options show' : 'options hide';
  }

  contentListClass = (index) => {
    let classnames = index === this.props.contentIndex[this.props.index] && this.props.onListClick ? 'line-bottom option active' : 'line-bottom option';
    return classnames;
  }

  onListClick = (index) => {
    if (this.props.onListClick) {
      this.props.onListClick(index);
    }
  }

  onTitleChange = () => {
    this.props.onTitleChange && this.props.onTitleChange(-1)
  }

  render() {
    // const {index} = this.props;
    return (
      <div className='customer-filters'>
        <ul className="tab-title">
          {
            this.props.titles.map((title, index) => {
              return (<li key={index} onClick={() => this.titleClick(index)} className={this.titleClass(index)}>
                <span className={classNames("text", { "long-text": this.props.titles.length < 3 })}>{this.titleContent(index)}</span>
                {index === 2 ? <Icon style={{ fontSize: '.3rem' }} icon="qianke-paixu" /> : <Icon icon="full-angle-down" />}
              </li>)
            })
          }
        </ul>
        <div className={classNames("tab-content", this.props.contentClassName)}>
          {
            this.props.titles.map((title, index) => {
              let content = this.props.contents[index];
              return (
                <ul key={index} className={this.contentClass(index)}>
                  {content && content.length > 0 ? content.map((item, index) => {

                    let events = this.props.onListClick ? { onClick: this.onListClick.bind(this, index) } : {};
                    return <li key={index}
                      {...events}
                      className={this.contentListClass(index)}>
                      {item.displayText}
                    </li>
                  }) : null}
                </ul>
              )
            })
          }
        </div>
        {/* <div className='tab-content-layer' onClick={ this.onTitleChange} style={{display: index!=-1?'block':'none'}}></div> */}
      </div>
    )
  }
}