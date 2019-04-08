import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './index.scss';
import PropTypes from 'prop-types';
// import FunMask from "../fun-mask";
import FunIcon from "../fun-icon";
// import FunDialog from "../fun-dialog";
import FunDynamicCore from "../fun-dynamic-core";
import FunInnerScroll from "../fun-inner-scroll";


/**
 *
 * 使用方法
 *
 * <FunMask ref={this.funMaskRef}></FunMask>
 *
 * // 显示 隐藏
 * this.funMaskRef.current.show();
 * this.funMaskRef.current.hide();
 *
 * 注：无法使用props控制mask 已经被废弃 否则会导致重复渲染
 *
 */
export default class FunModal extends FunDynamicCore {
  static propTypes = {
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    isShow: PropTypes.bool,
    onConfirm: PropTypes.func,
    hasConfirm: PropTypes.bool,
    title: PropTypes.string,
    unmountOnExit: PropTypes.bool,
    wrapperStyle: PropTypes.any,
    height: PropTypes.number,
    isScroll: PropTypes.bool
  };

  static defaultProps = {
    hasConfirm: false,
    unmountOnExit: true,
    isShow: false,
    isAutoDispose: false,
    isScroll: false
  };

  constructor(props) {
    super(props);

    this.containerRef = React.createRef();
  }

  show() {
    super.show();
  }

  hide() {
    super.hide();
  }

  onMaskHide() {
    super.hide();
  }

  onClickClose() {
    this.hide();
  }

  onClickConfirm() {
    this.hide();
    FunDynamicCore.doCall(this.props.onConfirm);
  }

  componentDidMount() {
    super.componentDidMount();
    let container = this.containerRef.current;

    if (!this.props.isScroll) {
      container.addEventListener('touchmove', function (e) {
        e.preventDefault();
      });
    }
  }

  onTouchMoveHeader(e) {
    e.preventDefault();
  }

  render() {
    const {
      isShow
    } = this.state;
    const {wrapperStyle, isScroll} = this.props;

    return ReactDOM.createPortal((
        <div ref={this.containerRef}>
          <CSSTransition
              in={isShow}
              timeout={250}
              classNames="fun-modal-container"
              unmountOnExit={this.props.unmountOnExit}

              onEnter={this.onEnter.bind(this)}
              onEntered={this.onEntered.bind(this)}

              onExit={this.onExit.bind(this)}

              onExited={this.onExited.bind(this)}
          >
            <div className="fun-modal-container">
              <div className="fun-modal" style={wrapperStyle} _fun-modal="true">

                <div className={'fun-modal-header'} onTouchMove={this.onTouchMoveHeader.bind(this)}>
                  <div className="left"  onClick={this.onClickClose.bind(this)}>
                    <FunIcon icon="close" />
                  </div>

                  <div className="fun-modal-title">{this.props.title}</div>

                  {
                    this.props.hasConfirm ? (
                        <div className={'icon-con right'} onClick={this.onClickConfirm.bind(this)}>
                          <FunIcon icon="confirm2" />
                        </div>
                    ): ''
                  }

                  <div className="line-top" />
                </div>

                {!isScroll ? (<div className={'fun-modal-wrapper'}>{this.props.children}</div>)
                      :
                      (<FunInnerScroll className={'fun-modal-wrapper'}>{this.props.children}</FunInnerScroll>)}

              </div>
              <div className="fd-back" onClick={this.onClickClose.bind(this)}  onTouchMove={this.onTouchMoveHeader.bind(this)}> </div>
            </div>
          </CSSTransition>
        </div>), this.el);
  }
}