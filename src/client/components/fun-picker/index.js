/**
 * Created by Aus on 2017/5/6.
 */
import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import FunModal from "../fun-modal";
import FunDynamicCore from "../fun-dynamic-core";
import PickerColumn from "./PickerColumn";

// 选择器组件
export default class FunPicker extends React.Component {
  static propTypes = {
    col: PropTypes.number.isRequired, // 列数
    data: PropTypes.array.isRequired, // 数据源  [{title, options}]
    prefixCls: PropTypes.string, // 前缀class
    value: PropTypes.array, // 初始值 多维的话需要一个数组[value1, value2, value3] / value
    defaultValue: PropTypes.any,
    title: PropTypes.string, // 题目文案
    cancelText: PropTypes.string, // 取消的文案
    confirmText: PropTypes.string, // 确认文案
    onChange: PropTypes.func, // 值变化的时候的回调
    onClose: PropTypes.func, // 点击取消之后的回调
    displayFiled: PropTypes.string,
    valueFiled: PropTypes.string,
    valueChangeCallBack: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'zby-picker',
    col: 1,
    title: '',
    cancelText: '取消',
    confirmText: '确定',
    onChange: empty,
    onCancel: empty,
    displayFiled: 'label',
    valueFiled: 'value'
  };

  hasShow = false;
  colsNum = 1; // 有几列
  selectedItem;

  constructor(props) {
    super(props);

    this.hasShow = false;
    this.modalRef = React.createRef();
    this.selectedValue = props.value || props.defaultValue;
    this.data = props.data;
  }

  // 当点击出发内容时候直接弹出
  onClickLink() {
    this.show();
  }

  show() {
    this.modalRef.current.show();
  }

  onClose() {
    FunDynamicCore.doCall(this.props.onClose);
  }

  onConfirm() {
    FunDynamicCore.doCall(this.props.onChange, this.selectedValue, this.selectedItem);
  }

  onValueChange(selectedItem, itemIndex, colIndex) {
    let value = FunPicker.getItemSimple(selectedItem, this.props.valueFiled);
    if (this.colsNum === 1) {
      this.selectedItem = selectedItem;
      this.selectedValue = value;
    } else {
      this.selectedValue[colIndex] = value;

      if (!this.selectedItem) {
        this.selectedItem = [];
      }
      this.selectedItem[colIndex] = value;
    }
  }

  getDefaultValue(data) {
    let result = [], length = data.length, options;

    for (let i = 0; i < length; i++) {
      options = data[i].options;
      result.push(FunPicker.getItemSimple(options[0], this.props.valueFiled));
    }

    if (this.colsNum === 1) {
      result = result[0];
    }
    return result;
  }

  /**
   * 获取简单值集
   * @param item
   * @param field
   * @returns {*}
   */
  static getItemSimple(item, field) {
    return typeof item === 'object' ? item[field] : item;
  }

  setData(data) {
    this.data = data;
    this.forceUpdate();
  }

  setValue(value, force) {
    if (this.selectedValue || force) {
      this.selectedValue = value;
      this.hasShow = false;
      this.forceUpdate();
    }
  }

  getValue() {
    return this.selectedValue || this.getDefaultValue(this.data);
  }

  getItemByValue(value) {
    let data = this.data, options, temp, selectedItem, item;

    if (!(value instanceof Array)) {
      value = [value];
    }

    for (let i = 0, l = data.length; i < l; i++) {
      options = data[i].options;

      for (let j = 0, l2 = options.length; j < l2; j++) {
        temp = value[i];
        item = options[j];
        if (temp === FunPicker.getItemSimple(item, this.props.valueFiled)) {
          selectedItem = item;
          break;
        }
      }

      if (!!selectedItem) {
        break;
      }
    }
    return selectedItem;
  }

  /**
   * 如果绑定的数据改变了或者值改变了
   * @param nextProps
   * @param nextState
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    let res = false;
    if (this.props.data !== nextProps.data) {
      this.setData(nextProps.data);
      res = true;
    }

    if (this.props.value !== nextProps.value) {
      this.setValue(nextProps.value);
      res = true;
    }
    return res;
  }

  static colKey = 1000;
  addColKey(colData) {
    if (typeof colData === 'object') {
      colData['key'] = 'col-key-' + (FunPicker.colKey++);
    }
  }

  getKey(item, index) {
    let key;
    if (typeof item === 'object') {
      key = item['key'];
    }
    return key || index;
  }

  getColumns() {
    let selectedValue, result = [], array, value, length, data, colData;
    let { displayFiled, valueField, valueChangeCallBack } = this.props;
    valueChangeCallBack = valueChangeCallBack || (() => { })

    data = this.data;
    if (!data) {
      return;
    }

    length = data.length;
    this.colsNum = length;
    // 获取选择的值
    selectedValue = this.getValue();
    this.selectedValue = selectedValue;
    this.selectedItem = this.getItemByValue(selectedValue);

    if (!(selectedValue instanceof Array)) {
      selectedValue = [selectedValue];
    }

    for (let i = 0; i < length; i++) {

      // {title, options}
      colData = data[i];
      this.addColKey(colData);

      result.push(
        <PickerColumn
          key={this.getKey(colData, i)}
          index={i}
          displayFiled={displayFiled}
          valueField={valueField}
          selectedItem={selectedValue[i]}
          data={colData.options}
          onValueChange={this.onValueChange.bind(this)}
          scrollCompleteCallback={(index) => valueChangeCallBack(this.selectedValue, index)}
        />
      );
    }
    return result;
  }

  onShow() {
    if (!this.hasShow) {
      this.hasShow = true;
      this.forceUpdate();
    }
  }

  render() {
    const { prefixCls, title, aa } = this.props;
    return (
      <div className={prefixCls}>
        <FunModal wrapperStyle={{ height: '200px' }} ref={this.modalRef}
          hasConfirm={true}
          onConfirm={this.onConfirm.bind(this)}
          isShow={false}
          unmountOnExit={false}
          onShow={this.onShow.bind(this)}
          title={title}
          onHide={this.onClose.bind(this)}>

          {this.hasShow ? (
            <div className={prefixCls + '-container'}>
              {this.getColumns()}
            </div>
          ) : ''}
        </FunModal>

        <div onClick={this.onClickLink.bind(this)}>
          {this.props.children}
          <div>{aa}</div>
        </div>
      </div>
    )
  }
}
function empty() { }
