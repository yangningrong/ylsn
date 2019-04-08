import React, { Fragment } from 'react';
import { BaseComponent, Components } from 'fun-plus';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Swiper from 'swiper/dist/js/swiper.js';

import "../../../../node_modules/swiper/dist/css/swiper.min.css";
import "./style.scss";

import photoIcon from '../../public/images/icon_work_photo.png'

const { Image, Icon } = Components

/**
 * 图片浏览组件
 */
export default class FunSwiper extends BaseComponent {

  static propTypes = {

    //少于10张，滑倒最后一张跳转相册，10张以上，第10张跳转
    newPage: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    //样式class
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    //图片列表
    images: PropTypes.array,

    photos: PropTypes.array,
    //初始index
    index: PropTypes.number,
  }

  static defaultProps = {
    images: [],
    titles: [],
    index: 0,
    photos: [],
    newPage: false
  }

  constructor(props) {
    super(props);
    this.state = {
      current: this.props.index,
      currentIndex: 0,
    };

    //初始化左滑
    this.startX = 0
    this.moveX = 0
    this.menuRef = React.createRef()
  }

  componentDidMount() {
    this.initSwiper();
  }

  initSwiper() {
    const that = this;
    const { newPage, index, images, openImg } = this.props;
    this.swiper = new Swiper('.swiper1-container', {

      zoom: true,
      initialSlide: index,
      passiveListeners: false,
      preventIntercationOnTransition: true,
      observer: true,
      observeParents: true,

      slidesPerView: 'auto',
      // resistanceRatio: 0,
      slideToClickedSlide: true,

      on: {
        init: function () {
          var slider = this;
          slider.slideTo(0)
        },
        touchStart: function (event) {
          event.preventDefault()
          var slider = this
          if (!newPage || slider.activeIndex !== images.length - 1) return
          //滑动开始时，设置初始化位置，并清除动画缓动效果
          that.startX = slider.translate
          that.menuRef.current.style.transition = 'none'
        },
        sliderMove: function (event) {
          event.preventDefault()
          var slider = this
          if (!newPage || slider.activeIndex !== images.length - 1) return
          //滑动时，实时计算轮播图滑动距离
          that.moveX = slider.previousTranslate - that.startX
          that.menuRef.current.style.transform = `translate3d(${that.moveX}px, 0px, 0px)`
          //移动位置超过75px时，更改显示样式
          if (that.moveX < -75) {
            that.menuRef.current.className = 'menu release'
          } else {
            that.menuRef.current.className = 'menu'
          }
        },
        touchEnd: function (event) {
          event.preventDefault()
          var slider = this
          if (!newPage || slider.activeIndex !== images.length - 1) return
          //滑动结束，判断移动距离，跳转或恢复原状
          if (that.moveX < -75) {
            that.props.newPage()
            return false
          }
          that.menuRef.current.style.transition = `.2s ease-in-out`
          that.menuRef.current.style.transform = `translate3d(0px, 0px, 0px)`
        },
        slideNextTransitionEnd: function () {
        }
      }
    });

    if (openImg) {
      this.swiper.on('click', () => {
        const { images } = this.props;
        const { current } = this.state
        if (images && images.length > 0) {
          openImg(current)
        }
      });
    } else {
      this.swiper.on('click', () => {
        const { photos } = this.props;
        if (photos && photos.length > 0) {
          newPage()
        }
      });
    }

    this.swiper.on('slideChangeTransitionEnd', () => this.onChange());
    this.swiper.on("touchStart", e => e.preventDefault());
  }

  onChange() {
    this.setState({
      current: this.swiper.realIndex
    });
  }

  handleBottomBarClick = () => {
    const { newPage } = this.props;
    if (!!newPage) {
      newPage()
    }
  }

  render() {
    const { images, newPage, photos } = this.props;
    const { current } = this.state;
    const size = images.length;
    const albumSize = photos.length > 1 ? photos.length : 1;

    return (
      <div className={classNames("image-swiper", this.props.className)}>
        <div className="swiper1-container">
          <div className="swiper-wrapper">
            {
              images.length > 0 ?
                images.map((item, index) => {
                  return (
                    <div className="swiper-slide content" key={index}>
                      <div className="swiper-zoom-container">
                        <Image className="fun-swiper-img" size="large" src={item.imageLinks || ''} scale={750 / 442} />
                      </div>
                    </div>
                  )
                })
                : (
                  <div className="swiper-slide content">
                    <div className="swiper-zoom-container">
                      <Image src={''} scale={750 / 442} />
                    </div>
                  </div>
                )}

          </div>
          {
            !!newPage && <div className="menu" ref={this.menuRef}>
              <Icon icon="angle-right-circle" className={`icon`} />
              <span className='text text-1'>左滑查看相册</span>
              <span className='text text-2'>释放查看相册</span>
            </div>
          }
        </div>
        <Fragment>
          {
            images.length > 0 &&
            <div className="bottom-bar" onClick={this.handleBottomBarClick}>
              {
                !photos.length
                  ?
                  <span>{`${current + 1}/${size}`}</span>
                  :
                  <Fragment><img src={photoIcon} /><span>{albumSize}</span></Fragment>
              }
            </div>
          }
        </Fragment>
      </div>
    );
  }
}
