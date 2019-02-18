import PropTypes from 'prop-types';
import BaseComponent from '../base-component';

/**
 * router change 监听器
 */
export default class RouterListener extends BaseComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    // 刷新完页面之后，初始调用一次 change 回调
    this.onRouterChange(this.context.router.history.location);
    // 注册 router change 事件回调
    this.unlisten = this.context.router.history.listen(this.onRouterChange.bind(this));
  }

  componentWillUnmount() {
    // 卸载 router change 事件回调
    this.unlisten();
  }

  /**
   * router change 事件回调
   * 
   * @param {Object} location history.location 对象
   */
  onRouterChange(location) {
    // 如果页面中某元素（非 body 元素）处于获取焦点状态，router change（切换页面）时使其失焦（使键盘收起）
    if (window.document.activeElement && document.activeElement === document.body) {
      window.document.activeElement.blur();
    }

    this.props.onChange && this.props.onChange(location);
  }

  render() {
    return this.props.children;
  }
}
