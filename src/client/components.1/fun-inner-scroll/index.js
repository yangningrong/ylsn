import React from 'react';
import './index.scss';
import FunDynamicCore from "../fun-dynamic-core";
import PropTypes from 'prop-types';
import { BaseComponent } from 'fun-plus';
import FunScroll from "../fun-scroll";

export const RE_TRANSLATE_MATRIX = /matrix(3d)?\((.+?)\)/;
/**
 * 滚动组件
 * 使用方法
 * <FunScroll>
 *   <div>内容</div>
 * </FunScroll>
 */
export default class FunInnerScroll extends FunScroll {

  static propTypes = {
    className: PropTypes.string,
    wrapperStyle: PropTypes.any,
    containerStyle: PropTypes.any,
    contentStyle: PropTypes.any
  };

  render() {
    return (
        <div className={'main-container ' + (this.props.className || '')} _fun-inner-scroll="true" style={this.props.containerStyle}>
          <div ref={this.scrollWrapperRef} className={'scroll-wrapper '} _fun-inner-scroll="true" style={this.props.wrapperStyle}>
            <div ref={this.scrollContentRef} className="scroll-content" style={this.props.contentStyle} _fun-inner-scroll="true">
              {this.props.children}
            </div>
          </div>
        </div>
    )
  }

}