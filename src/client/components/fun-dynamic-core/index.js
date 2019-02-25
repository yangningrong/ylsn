import React from 'react';
import PropTypes from 'prop-types';
import { BaseComponent } from 'fun-plus';

export default class FunDynamicCore extends BaseComponent{
  static propTypes = {
    isAutoDispose: PropTypes.bool,
    container: PropTypes.any,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    isShow: PropTypes.bool,
    instance: PropTypes.object
  };

  static defaultProps = {
    isAutoDispose: true,
    disableToggle: false,
    isShow: true
  };

  static doCall(call, ...args) {
    if (typeof call === "function") {
      call(...args);
    }
  }

  static getDom() {
    let dom = document.createElement("div");
    dom.className = 'fun-dynamic-core';
    document.body.appendChild(dom);
    return dom;
  }

  static blur() {
    let input = document.activeElement || document.querySelector("input:focus");
    if (input && input.tagName.toLowerCase() === "input") {
      input.blur();
      return input;
    }
  }

  static getInstanceRef() {
    return {
      current: null,
      hide: function (...args) {
        let current = this.current;
        if (current.hide) {
          current.hide(...args);
        }else {
          console.log('instanced');
          setTimeout(() => {
            this.hide(...args);
          }, 100);
        }
      },
      show: function (...args) {
        let current = this.current;
        if (current && current.show) {
          current.show(...args);
        }
      },
    }
  }

  el = null;
  constructor(props) {
    super(props);

    if (this.props.instance) {
      this.props.instance.current = this;
    }

    this.state = {
      isShow: false
    };

    // 渲染的目标节点
    if (!props.container) {
      this.el = FunDynamicCore.getDom();
    }
  }

  componentDidMount() {
    if (this.state.isShow !== this.props.isShow) {
      this.setState({isShow:  this.props.isShow});
    }

    // 如果不存在container 说明需要拼接el
    if (!!this.el) {
      document.body.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    this.dispose();
  }

  show(info) {
    FunDynamicCore.blur();
    this.setState({
      isShow: true
    });
  }

  hide() {
    this.setState({isShow: false});
  }

  onEnter() {
    FunDynamicCore.doCall(this.props.onShow);
  }

  onEntered() {
    FunDynamicCore.blur();
  }

  onExit() {
    FunDynamicCore.doCall(this.props.onHide);
  }

  onExited() {
    let props = this.props, container = props.container;
    if (props.isAutoDispose){
      this.dispose();
    }
  }

  dispose() {
    let container = this.props.container;
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }

    container = this.el;
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
