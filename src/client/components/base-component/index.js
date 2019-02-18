import {Component} from 'react';

/**
 * 组件的公共父类，每个组件中应该都会有一些公共的东西（如统一的组件埋点等操作），把这些逻辑提取到父类中实现，不用每个组件中都写一遍，
 * 也可在这里定义一些公共的方法，给子类调用
 */
export default class BaseComponent extends Component {
  
}
