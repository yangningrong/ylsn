import React from 'react';
import PropTypes from 'prop-types';
import { BaseComponent } from 'fun-plus';

/**
 *
 * 字体图标 组件
 * 使用方法：
 * <FunIcon icon="angle-left"></FunIcon>
 *
 */
export default class FunIcon extends BaseComponent {

  static propTypes = {
    icon: PropTypes.string,
    iconStyle: PropTypes.object,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <span style={this.props.iconStyle} className={`fun-icon f-icon-${this.props.icon}`}></span>
    )
  }

}