/**
 * Created by Aus on 2017/5/24.
 */
import React from 'react';
import PropTypes from 'prop-types';
import PickerColumn from './PickerColumn';
import './picker-view.scss';
import FunDynamicCore from "../fun-dynamic-core";

// 递归寻找value
function getNewValue(tree, oldValue, newValue, deep) {
  // 遍历tree
  let has;

  tree.map((item, i) => {
    if (item.value === oldValue[deep]) {
      newValue.push(item.value);
      has = i;
    }
  });

  if (has === undefined) {
    has = 0;
    newValue.push(tree[has].value);
  }

  if (tree[has].children) getNewValue(tree[has].children, oldValue, newValue, deep + 1);

  return newValue;
}

// 根据value找索引
function getColumnsData(tree, value, hasFind, deep) {
  // 遍历tree
  let has;
  const array = [];

  tree.map((item, i) => {
    array.push({ label: item.label, value: item.value });
    if (item.value === value[deep]) has = i;
  });

  // 判断有没有找到
  // 没找到return
  // 找到了 没有下一集 也return
  // 有下一级 则递归
  if (has === undefined) return hasFind;

  hasFind.push(array);

  if (tree[has].children) getColumnsData(tree[has].children, value, hasFind, deep + 1);

  return hasFind;
}


// 选择器组件
export default class PickerView extends React.Component {

  static propTypes = {
    prefixCls: PropTypes.string, // 前缀class
    col: PropTypes.number,
    data: PropTypes.array,
    value: PropTypes.any,
    controlled: PropTypes.bool, // 是否受控
    onChange: PropTypes.func
  };

  static defaultProps = {
    prefixCls: 'zby-picker-view',
    col: 1,
    controlled: false,
  };

  selectedValue = [];

  constructor(props) {
    super(props);
    this.selectedValue = [];
  }

  // picker view 当做一个非受控组件
  componentDidMount() {
    this.selectedValue = this.props.value;
    this.forceUpdate();
  }

  // 子组件column发生变化的回调函数
  // 每次值发生变化 都要判断整个值数组的新值
  handleValueChange(newValue, index) {
    const { onChange } = this.props;

    let oldValue = this.selectedValue;

    if (oldValue instanceof Array) {
      oldValue[index] = newValue;
    } else {
      oldValue = newValue;
    }

    // 不级联 单纯改对应数据
    this.selectedValue = oldValue;
    FunDynamicCore.doCall(onChange, oldValue, index);
  }


  getColumns() {
    let { col, data } = this.props;
    let selectedValue = this.selectedValue, result = [], array, value;

    if (!selectedValue || selectedValue.length === 0) {
      return;
    }

    array = data;

    if (!(array[0] instanceof Array)) {
      array = [array];
    }
    col = col || array.length;


    for (let i = 0; i < col; i++) {
      if (selectedValue instanceof Array) {
        value = selectedValue[i];
      } else {
        value = selectedValue;
      }
      result.push(
        <PickerColumn
          key={i}
          index={i}
          selectedItem={value}
          data={array[i]}
          onValueChange={this.handleValueChange.bind(this)}
        />
      );
    }
    return result;
  }
  render() {
    const { prefixCls } = this.props;
    const columns = this.getColumns();

    return (
      <div className={prefixCls}>
        {columns}
      </div>
    )
  }
}

