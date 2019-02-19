/**
 *
 * 谢谢博客园网友的代码支持 原作者aus
 * Created by Aus on 2017/5/25.
 * new by pcCold on 2018/9/29
 * 解决伸缩列的z轴坐标滚动问题
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import ZScroller from 'zscroller';
import classNames from 'classnames';
import './picker-column.scss';
import FunDynamicCore from "../fun-dynamic-core";

// picker-view 中的列
export default class PickerColumn extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string, // 前缀class
    index: PropTypes.number.isRequired,
    data: PropTypes.any,
    selectedItem: PropTypes.any,
    displayFiled: PropTypes.string,
    valueFiled: PropTypes.string,
    onValueChange: PropTypes.func,
    scrollCompleteCallback: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'zby-picker-column',
    displayFiled: 'label',
    valueFiled: 'value'
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.selectedItem = props.selectedItem;
    this.selectedIndex = 0;
  }

  componentDidMount() {
    // getBoundingClientRect js原生方法
    // 根据变量判断dom是否渲染完毕
    this.itemHeight = this.refs.indicator.getBoundingClientRect().height;
    // 绑定事件
    this.bindScrollEvent();
    // 列表滚到对应位置
    this.scrollToPosition();
  }

  componentDidUpdate() {
    this.zscroller.reflow();
    this.scrollToPosition();
  }
  componentWillUnmount() {
    this.zscroller.destroy();
  }
  bindScrollEvent() {
    // 绑定滚动的事件
    const content = this.refs.content;

    // getBoundingClientRect js原生方法
    this.refs.indicator.getBoundingClientRect().height;

    // 最后还是用了何一鸣的zscroll插件
    // 但是这个插件并没有太多的文档介绍 gg
    // 插件demo地址：http://yiminghe.me/zscroller/examples/demo.html
    this.zscroller = new ZScroller(content, {
      scrollbars: false,
      scrollingX: false,
      zooming: false,
      snapping: true, // 滚动结束之后 滑动对应的位置
      penetrationDeceleration: .1,
      minVelocityToKeepDecelerating: 0.5,
      scrollingComplete: this.onScrollComplete.bind(this),
      onScroll: (e) => {
        this.onScroll(e);
      }
    });

    // 设置每个格子的高度 这样滚动结束 自动滚到对应格子上
    // 单位必须是px 所以要动态取一下
    this.zscroller.scroller.setSnapSize(0, this.itemHeight);
  }

  // 新方法，在滚动完成时触发，和滚动事件有所区别
  onScrollComplete(e) {
    this.onScrollingComplete();
    if (this.props.scrollCompleteCallback) {
      const { index } = this.props;
      this.props.scrollCompleteCallback(index);
    }
  }

  onScroll(e) {
    // debugger;
    // console.log(this.zscroller.scroller);
    this.onScrollingComplete();
  }

  onScrollingComplete() {
    // 滚动结束 判断当前选中值
    const { top } = this.zscroller.scroller.getValues();
    const { data, index, onValueChange } = this.props;

    let currentIndex = (top / this.itemHeight) || 0;
    const floor = Math.floor(currentIndex);
    if (currentIndex - floor > 0.5) {
      currentIndex = floor + 1;
    } else {
      currentIndex = floor;
    }

    if (this.selectedIndex === currentIndex) {
      return;
    }

    let selectedItem = data[currentIndex];
    if (selectedItem) {
      this.zscroller.content.children[this.selectedIndex].classList.remove('selected');
      this.selectedIndex = currentIndex;
      this.zscroller.content.children[currentIndex].classList.add('selected');
      this.selectedValue = selectedItem;
      FunDynamicCore.doCall(onValueChange, selectedItem, currentIndex, index);
    }
  }

  scrollToPosition() {
    // 滚动到选中的位置
    let currentIndex = 0;
    const { data, selectedItem } = this.props;
    for (let i = 0; i < data.length; i++) {
      if (this.getValue(data[i]) === this.getValue(selectedItem)) {
        currentIndex = i;
        break;
      }
    }
    this.selectByIndex(currentIndex);
  }

  selectByIndex(index) {
    // 滚动到index对应的位置
    const top = this.itemHeight * index;
    this.zscroller.scroller.scrollTo(500, top);
  }

  /**
   * @param {number} time 设置的时间 毫秒
   */
  setTransitionTime(time) {
    let element = this.zscroller.content;
    let elementStyle = element.style;
    elementStyle.webkitTransitionDuration = time + 'ms';
    elementStyle.transitionDuration = time + 'ms';
  }

  getValue(item) {
    return typeof item === 'object' ? item[this.props.valueFiled] : item;
  }

  getDisplay(item) {
    return typeof item === 'object' ? item[this.props.displayFiled] : item;
  }

  onClickItem(item, index) {
    this.setTransitionTime(300);
    this.selectByIndex(index);

    setTimeout(() => {
      this.setTransitionTime(0);
    }, 300);
  }

  // 根据value 和 index 获取到对应的data
  getCols() {
    let { data, prefixCls } = this.props;
    let className;
    let selectedItem = this.selectedItem;

    return data.map((item, i) => {
      let isSelected = this.getValue(data[i]) === this.getValue(selectedItem);
      if (isSelected) {
        this.selectedIndex = i;
      }
      className = classNames([`${prefixCls}-col`, { 'selected': isSelected }]);
      return (<div key={i + '-' + i} onClick={() => {
        this.onClickItem(item, i);
      }} className={className}>{this.getDisplay(data[i])}</div>);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    let { prefixCls } = this.props;

    return (
      <div className={prefixCls}>
        <div className={`${prefixCls}-list`}>
          <div className={`${prefixCls}-window`} />
          <div className={`${prefixCls}-indicator`} ref='indicator'>
            <div className={`${prefixCls}-line line-bottom ${prefixCls}-top`}></div>
            <div className={`${prefixCls}-line line-bottom`}></div>
          </div>
          <div className={`${prefixCls}-content`} ref='content'>
            {this.getCols()}
          </div>
        </div>
      </div>
    )
  }
}
