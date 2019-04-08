import React from 'react';
import './index.scss';
import FunDynamicCore from "../fun-dynamic-core";
import PropTypes from 'prop-types';
import { BaseComponent } from 'fun-plus';

export const RE_TRANSLATE_MATRIX = /matrix(3d)?\((.+?)\)/;
/**
 * 滚动组件
 * 使用方法
 * <FunScroll>
 *   <div>内容</div>
 * </FunScroll>
 */
export default class FunScroll extends BaseComponent {

  static _console(text) {
    document.getElementById("console_test_id").innerText = text;
    document.getElementById("console_test_id").style.display = "block";
  }
  static getStyle(t) {
    return t.currentStyle || getComputedStyle(t);
  }

  static propTypes = {
    contentStyle: PropTypes.any
  };

  static defaultProps = {

  };

  // 最大的下拉距离
  maxPullDownDistance = 200;

  // 最大上拉的距离
  maxPullUpDistance = 200;

  // 滚动的容器
  scrollWrapperRef = null;
  scrollWrapperElement = null;

  // 滚动的距离
  scrollContentRef = null;
  scrollContentElement = null;

  // touch的数据
  _touchData = {
    x0: 0,
    y0: 0,
    xt: 0,
    yt: 0,
    direct: 0,
    isTop: false,
    isBottom: false,
    isStart: false,
    isTouch: false,
    isDrag: false
  };

  // 自动滚动的数据
  _autoScrollData = {
    y0: 0,
    yt: 0,
    nowTime: 0,
    lastTime: 0,
    speed: []
  };

  _isLock = false; // 是否锁定整个操作

  constructor(props) {
    super(props);
    this.scrollWrapperRef = React.createRef();
    this.scrollContentRef = React.createRef();
    this.containerRef = React.createRef();
    this.scrollBackRef = React.createRef();
  }

  componentDidMount() {
    this.scrollWrapperElement = this.scrollWrapperRef.current;
    this.scrollContentElement = this.scrollContentRef.current;
    this.initScroll();
  }

  initScroll() {
    let wrapper = this.scrollWrapperElement;
    let eventName = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      cancel: 'touchcancel',
      scroll: 'scroll'
    };

    // 触摸开始
    if (this.scrollBackRef.current) {
      this.scrollBackRef.current.addEventListener(eventName.start, (e) => {
        this.stop(e);
      });
    }

    // 触摸开始
    wrapper.addEventListener(eventName.start, (e) => {
      this.onTouchStart(e);
    });

    wrapper.addEventListener(eventName.move, (e) => {
      this.onTouchMove(e);
    });


    wrapper.addEventListener(eventName.end, () => {
      this.onTouchEnd();
    });


    wrapper.addEventListener(eventName.cancel, () => {
      this.onTouchEnd();
    });

    wrapper.addEventListener(eventName.scroll, () => {
      // 触发滚动事件
      this.triggerScroll();
    });
  }

  onTouchStart(e) {
    let touchData = this._touchData;
    let touches = e.targetTouches;
    touchData.y0 = touchData.yt = touches[0].clientY;
    touchData.x0 = touchData.xt = touches[0].clientX;
    touchData.direct = 0;
    touchData.isStart = true;
    this.stopTransitionMove();

    let transform = this.parseTranslateMatrix(this.scrollWrapperElement);
    if (transform.y !== 0) {
      this.stop(e);
    }
  }

  /**
   *
   * @param e touch事件
   * 追踪touch
   * 判断方向
   *
   */
  onTouchMove(e) {
    let transform = this.parseTranslateMatrix(this.scrollWrapperElement);
    let touches = e.targetTouches;
    let touchData = this._touchData;

    touchData.y0 = touchData.yt;
    touchData.yt = touches[0].clientY;

    touchData.x0 = touchData.xt;
    touchData.xt = touches[0].clientX;

    // 防止角度
    if (Math.abs(touchData.xt - touchData.x0) / Math.abs(touchData.yt - touchData.y0) > 0.8) {
      return this.stop(e);
    }

    if (touchData.yt > touchData.y0) {
      touchData.direct = 1;
    } else if (touchData.yt < touchData.y0) {
      touchData.direct = -1;
    } else {
      touchData.direct = 0;
    }

    // FunScroll._console("no" + scrollTop + "transform" + transform.y);
    let scrollTop = this.getScrollTop();
    if (transform.y !== 0 || (scrollTop <= 0 && touchData.direct === 1) || (scrollTop > this.getMaxScrollTop() ** touchData.direct === -1)){
      this.stop(e);
    }

    if (touchData.isDrag) {
      this.stop(e);
      this.drag();
    } else {
      touchData.isBottom = this.isBottom(touchData.direct);
      touchData.isTop = this.isTop(touchData.direct);

      if (touchData.isBottom || touchData.isTop) {
        this.stop(e);
        if (touchData.isStart) {
          touchData.isDrag = true;
        }
      }
    }

    touchData.isStart = false;
  }

  // 在结局滑动之后做的操作
  onTouchEnd() {
    let touchData = this._touchData;

    if (touchData.isDrag && !this._isLock) {
      this.back();
    }

    touchData.y0 = touchData.yt = 0;
    touchData.direct = 0;
    touchData.isTop = false;
    touchData.isBottom = false;
    touchData.isTouch = false;
    touchData.isDrag = false;

    this._autoScrollData = {
      y0: 0,
      yt: 0,
      lastTime: 0,
      nowTime: 0,
      speed: []
    };
  }

  // 判断滚动条是否在顶部
  isTop(direct) {
    return this.getScrollTop() <= 0 && direct === 1;
  }

  // 判断滚动条是否在底部
  isBottom(direct) {
    let scrollTop = this.getScrollTop();
    let pageHeight = this.scrollWrapperElement.offsetHeight;
    let totalHeight = this.scrollContentElement.offsetHeight;
    return direct === -1 && totalHeight - 2 < pageHeight + scrollTop;
  }

  // 获取滚动条滚动的位置
  getScrollTop() {
    return this.scrollWrapperElement.scrollTop || 0;
  }

  // 最大的滚动距离
  getMaxScrollTop() {
    let pageHeight = this.scrollWrapperElement.offsetHeight;
    let totalHeight = this.scrollContentElement.offsetHeight;
    let max = totalHeight - pageHeight;

    if (max < 0) {
      max = 1;
    }
    return max;
  }

  /**
   * 阻止浏览器默认行为
   * @param e
   */
  stop(e) {
    try{
      // e.stopPropagation();
      e.preventDefault();
    }catch (e) {
      console.log(e);
    }
  }

  /**
   *
   * @param top 设置滚动的距离
   *
   */
  setScrollTop(top) {
    this.scrollWrapperElement.scrollTop = top;
  }

  /**
   * 拖拽的事件
   */
  drag() {
    let touchData, dy, transform, y, isTop;

    touchData = this._touchData;
    isTop = touchData.isTop;
    dy = touchData.yt - touchData.y0;

    // 根据dy设置偏移的距离
    transform = this.parseTranslateMatrix(this.scrollWrapperElement);
    dy = dy * ( 1 - (Math.abs(transform.y) / this.maxPullDownDistance)) * 0.8 + touchData.direct * 0.1;
    y = transform.y + dy;

    if (isTop) {
      if (y < 0) {
        y = 0;
      } else if ( y > this.maxPullDownDistance) {
        y = this.maxPullDownDistance;
      }
    } else {
      if (y > 0) {
        y = 0;
      } else if (Math.abs(y) > this.maxPullUpDistance) {
        y = -this.maxPullUpDistance;
      }
    }

    if (this.getScrollTop() < 0 || this.getScrollTop() > this.getMaxScrollTop()) {
      y = 0;
    }

    this.setTransitionTime(0);

    if (FunDynamicCore.blur()) {
      this.back();
    }else {
      this.setTranslateAfter(y);
    }
  }

  // transform 的xyz
  parseTranslateMatrix(dom) {
    let style = FunScroll.getStyle(dom);
    let matrix = style['webkitTransform'].match(RE_TRANSLATE_MATRIX);
    let is3D = matrix && matrix[1];

    if (matrix) {
      matrix = matrix[2].split(",");

      if (is3D === "3d") {
        matrix = matrix.slice(12, 15);
      } else {
        matrix.push('0');
        matrix = matrix.slice(4, 7);
      }

    } else {
      matrix = ['0', '0', '0'];
    }

    return {
      x: parseFloat(matrix[0]),
      y: parseFloat(matrix[1]),
      z: parseFloat(matrix[2])
    };
  }

  /**
   *
   * @param {number} diff 距离
   * 设置translate
   */
  setTranslate(diff) {
    let elementStyle = this.scrollWrapperElement.style;
    elementStyle.webkitTransform = 'translate3d(0,' + diff + 'px,0)';
    elementStyle.transform = 'translate3d(0,' + diff + 'px,0)';

    if (this.requestFrameId) {
      cancelAnimationFrame(this.requestFrameId);
      this.requestFrameId = null;
      this.isTranslating = false;
    }
  }

  /**
   *
   * @param diff 设置的距离
   * @param frames 要间隔的帧数
   */
  isTranslating = false; // 一个标记
  requestFrameId = null;
  setTranslateAfter(diff, frames = 1) {
    if (this.isTranslating) {
      return;
    }else {
      this.isTranslating = true;
    }

    let _this = this, currentFrame = 0;
    set();

    function set() {
      if (currentFrame >= frames) {
        _this.setTranslate(diff);
      }else {
        currentFrame ++;
        _this.requestFrameId = requestAnimationFrame(set);
      }
    }
  }

  /**
   *
   * @param {ElementRef} elementRef 元素
   * @param {number} time 设置的时间 毫秒
   *
   */
  setTransitionTime(time) {
    let elementStyle = this.scrollWrapperElement.style;
    elementStyle.webkitTransitionDuration = time + 'ms';
    elementStyle.transitionDuration = time + 'ms';
  }

  // 停止移动
  stopTransitionMove() {
    let matrix = this.parseTranslateMatrix(this.scrollContentElement);
    this.setTransitionTime(0);
    this.setTranslate(matrix.y);
  }

  // 回弹
  back() {
    let matrix = this.parseTranslateMatrix(this.scrollWrapperElement);
    let time = 300 + parseInt(Math.abs(matrix.y) / this.maxPullDownDistance * 300 + '');
    this.setTransitionTime(time);
    this.setTranslate(0);
  }

  // 触发滚动事件
  triggerScroll() {
  }

  render() {
    return (
        <div ref={this.containerRef} className="main-container" _fun-scroll="true">
          <div ref={this.scrollBackRef} className={'scroll-back'} _fun-scroll="true"></div>
          <div ref={this.scrollWrapperRef} className="scroll-wrapper" _fun-scroll="true">
            <div ref={this.scrollContentRef} className="scroll-content" style={this.props.contentStyle}>
              {this.props.children}
            </div>
          </div>
        </div>
    )
  }

}