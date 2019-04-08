import React from 'react';

import { Components, Url } from 'fun-plus';
import FunSwiper from '../../components/fun-swiper';
import model from "./model.js";

import ApartMent from "../../public/images/apartment.jpg";
import Location from "../../public/images/location.png";

import "./style.scss";

const { BasePage, GradientHeader, Image, Button } = Components;
const { Query } = Url;

export default class NewCustomer extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      projectName: '方禺',
      projectId: parseInt(Query.getQuery('projectId'), 10) || 0,
      getDetail: {},
      detailData: {}
    }
  }

  componentWillMount() {
    // const { projectId } = this.state;
    // model.getDetail({ projectId })
    //   .then((res) => {
    //     const { projectId, projectName } = res;
    //     const historyDate = {
    //       projectId,
    //       projectName
    //     }
    //     if (platform.isWechat) {
    //       this.shareConfig = this.getShareContent(res)
    //       this.setShareData(this.shareConfig)
    //     }
    //     this.setState({
    //       detailData: res,
    //     });
    //     if (!!res.maps.length) {
    //       this.getPoiAround(0)
    //     }
    //   });
  }

  // getShareContent = (res) => {
  //   const { projectName, projectId } = res;
  //   let url = window.location.href;
  //   if (projectId) {
  //     url = url.indexOf('?projectId') > 0 ? `${url}` : `${url}?projectId=${projectId}`;
  //   }
  // }

  // getPoiAround(index) {
  //   index = index || 0;
  //   model.currentPoiIndex = index;
  //   model.currentPoiType = this.poiTypes[index].type;
  //   const { projectId } = this.state.detailData;
  //   model.getPoiRecommend({
  //     projectId
  //   })
  //     .then(res => {
  //       delete res._response_
  //       this.setState({
  //         poiRecommend: res
  //       })
  //     })
  //   model.getPoiAround({
  //     projectId,
  //     index,
  //     poiType: this.poiTypes[index].type,
  //   })
  //     .then(() => {
  //       //交通只显示公交和地铁
  //       if (index === 0 && model.poiContents[0] && model.poiContents[0].length > 0) {
  //         model.poiContents[0] = model.poiContents[0].filter((item) => {
  //           return (item.typeName === "地铁" || item.typeName === "公交");
  //         });
  //       }
  //       this.setState({ poiContents: model.poiContents });
  //     });
  // }

  // gotoPhoto = (photos) => {
  //   this.props.history.push("/photos", {
  //     photos,
  //     shareConfig: this.shareConfig
  //   })
  // }

  render() {
    const {
      detailData: {
        carouselPhotos,
        photos
      }
    } = this.state;
    return (
      <div className="detail">
        <GradientHeader
          hasBorder={true}
          hasBack={true}
          hasMore={true}
          gradientHeader="方禺"
        />
        <section className="detail-banner">
          <img src={ApartMent} className="banner-img" />
        </section>

        {/* 详情项目介绍 */}

        <div className="detail-project">
          <h3>方禺公寓中骏广场店</h3>
          <p className="location">
            <span><img src={Location} />闵行-虹桥机场 申长路1588号</span>
          </p>
          <p className="detail-price">
            <span className="rmb">¥</span>
            <span className="price"> 4200 </span>
            <span className="unit">/月起</span>
            <span className="instruction"> 租金说明 > </span>
          </p>

          <p className="welfare">
            <span>免费健身</span>
            <span>押一付一</span>
            <span>满减</span>
          </p>
        </div>
        {/* line */}
        <div></div>
        {/* 设施 */}
        <div className="installation">
          <div className="white line-top">

            <div className="jianshenfang">
              <span><img src={"http://h5.funlive.net.cn/h5/statics/img/parts/jianshenfang.png"} className="installation-icon" /></span><br />
              <span className="installation-name">健身房</span>
            </div>
            <div className="jianshenfang">
              <span><img src={"http://h5.funlive.net.cn/h5/statics/img/parts/yujiashi.png"} className="installation-icon" /></span><br />
              <span className="installation-name">瑜伽室</span>
            </div>
            <div className="jianshenfang">
              <span><img src={"http://h5.funlive.net.cn/h5/statics/img/parts/taiqiushi.png"} className="installation-icon" /></span><br />
              <span className="installation-name">台球室</span>
            </div>
            <div className="jianshenfang">
              <span><img src={"http://h5.funlive.net.cn/h5/statics/img/parts/24hguanjia.png"} className="installation-icon" /></span><br />
              <span className="installation-name">24h管家</span>
            </div>
            <div className="jianshenfang">
              <span><img src={"http://h5.funlive.net.cn/h5/statics/img/parts/zhinengmensuo.png"} className="installation-icon" /></span><br />
              <span className="installation-name">智能锁门</span>
            </div>
            <div className="jianshenfang">
              <span><img src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAnFBMVEVHcEzt8PTt7/Tu8PTv7/ft7/Xs7vX////t7/Xx8fjt7/Ts7/Tt7/Tt7vTs7/Tt7vXu8fXt7/Xu7vfw8Pjs7vbt7/Xt7/Xt7/Xt7/X////t7/Xt7vT////w8Pft7vXu7/Xs7vXs7/Ts7/X////t8Pbs7/Tu7vfu7vnt7/Xs7/Xs7vbt7/Xs7/Xs7vS2vczHy9jf4+q8ws/T1+HS1+HQQCN9AAAALXRSTlMARo91IPv3BX0l7Nrv0l/jSv0eIoj6nf75B9+nAkPEofOk+AhVvzwufsqHyXwO9AwRAAACJ0lEQVRo3s2a2ZKCMBBF40pEcV/BBVQUl3ab//+3UdQZHaNC6GvNeUwVpyhIOp3uCBGByXy69oaWbXa7pm0NvfV0PhEcGDPpj+mBsS9nRjJzfzBy6SnuaNDXVtebFXpDpVnXUhfaLYpAq12IrW44NYpIzWnEUvdknmKQl73o7lSRYlJMRZ18adIgHWliZhekxSr73l0tkSal6jt3OUfa5Mqv3ZkOJaCTeeVeUkKWL96bEvP03cud5PLOk+9ezREDOeWcyZaIhZJivhsrYmL1uFbTxEb6IVYRI3+iWK/IKS/eR+CAWJF3+06eV56/3ZscYsa52Ytr3PLa767dJnbaP/lJi1/euuYzTQLQvORsFYS8cs70BgRhEMpHGPkoDIcuRu6eguOMQMz4w8p9gPFRcv943hmj5OOJmBOMuZji5FMhcfK18HByTwxx8qGwlOO77X6/3SUZPWIJW+U+bEIO+qMnbGGq3ntzYac7GmKKrkK+vT6w1R0N6Srl++sDe93Ri9zEyU3lD2X6LLZyKjL9UEu9iL6U0yvO6HkRebhF5GEDFzTkQjcL6DYH3aBxf1SikyJoOgdNRLEpNDT5hx5bsAcu6FERe8iFHs+xhQXuACM/V8yBlqGwBTRhLLjcC+OzRUtsuRVbKMaWuLHFeWxbAdsQwbZysE0obPsM2/g7ReAgXssy6P2XZiu4TQxucINb85dLBYH6UkGQ9FLB73UIeXsdQka8DvENmf+L2O6i65oAAAAASUVORK5CYII="} className="installation-icon" /></span><br />
              <span className="installation-name">全部设备</span>
            </div>

          </div>


        </div>
        <div className="room-hot">热门房型</div>
        <div className="rooms">
          <div className="room-type">
            <div className="left"><img src="https://flcdn.funplus.cn/roomType/154702651230467293f16-dde9-4543-9fec-50e80946db5a?x-oss-process=image/resize,w_375/quality,Q_90" alt="" /></div>
            <div className="center">
              <p className="style">简约单间</p>
              <p className="tingwei">1室1厅   15㎡起</p>
              <p className="danjia"> ¥ <span className="rmb">4200</span> / 月起 </p>
            </div>
            <div className="right">
              <Button className="order-btn" type="primary" >
                立即预订
            </Button>
            </div>
          </div>
        </div>
        <div className="rooms">
          <div className="room-type">
            <div className="left"><img src="https://flcdn.funplus.cn/roomType/154702651230467293f16-dde9-4543-9fec-50e80946db5a?x-oss-process=image/resize,w_375/quality,Q_90" alt="" /></div>
            <div className="center">
              <p className="style">简约单间</p>
              <p className="tingwei">1室1厅   15㎡起</p>
              <p className="danjia"> ¥ <span className="rmb">4200</span> / 月起 </p>
            </div>
            <div className="right">
              <Button className="order-btn" type="primary" >
                立即预订
            </Button>
            </div>
          </div>
        </div>
        <div className="rooms">
          <div className="room-type">
            <div className="left"><img src="https://flcdn.funplus.cn/roomType/154702651230467293f16-dde9-4543-9fec-50e80946db5a?x-oss-process=image/resize,w_375/quality,Q_90" alt="" /></div>
            <div className="center">
              <p className="style">简约单间</p>
              <p className="tingwei">1室1厅   15㎡起</p>
              <p className="danjia"> ¥ <span className="rmb">4200</span> / 月起 </p>
            </div>
            <div className="right">
              <Button className="order-btn" type="primary" >
                立即预订
            </Button>
            </div>
          </div>
        </div>
        <div className="rooms">
          <div className="room-type">
            <div className="left"><img src="https://flcdn.funplus.cn/roomType/154702651230467293f16-dde9-4543-9fec-50e80946db5a?x-oss-process=image/resize,w_375/quality,Q_90" alt="" /></div>
            <div className="center">
              <p className="style">简约单间</p>
              <p className="tingwei">1室1厅   15㎡起</p>
              <p className="danjia"> ¥ <span className="rmb">4200</span> / 月起 </p>
            </div>
            <div className="right">
              <Button className="order-btn" type="primary" >
                立即预订
            </Button>
            </div>
          </div>
        </div>
        <div className="rooms">
          <div className="room-type">
            <div className="left"><img src="https://flcdn.funplus.cn/roomType/154702651230467293f16-dde9-4543-9fec-50e80946db5a?x-oss-process=image/resize,w_375/quality,Q_90" alt="" /></div>
            <div className="center">
              <p className="style">简约单间</p>
              <p className="tingwei">1室1厅   15㎡起</p>
              <p className="danjia"> ¥ <span className="rmb">4200</span> / 月起 </p>
            </div>
            <div className="right">
              <Button className="order-btn" type="primary" >
                立即预订
            </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}