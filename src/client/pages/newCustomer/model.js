import { Http } from 'fun-plus';

class Model {

    getDetail(param) {
      return Http.post('funwork/project/project-detail', param, {
        handleError: '',
        showLoading: true
      });
    }

    getList(param) {
      return Http.post('funwork/project/meeting-room-list', param, {
        handleError: '',
        showLoading: true
      });
    }

    getPoiRecommend(params) {
      return Http.post('funwork/project/poi-recommended', params, {
        handleError: '',
        showLoading: true
      })
    }

    //获取poi周边
    getPoiAround(params) {
      let index = params.index;

      return Http.post('funwork/project/poi-list', params)
        .then((data) => {
          if (!this.poiContents) {
            this.poiContents = [];
          }
          this.poiContents[index] = data.list || [];
        });
    }

    //获取weixin jssdk ticket
    async getWxJsSdkTicket (url) {
      return Http.post('weixin/security/get-access-credentials', {url});
    }

     // 对图片进行处理
    ctrlPicList(photoDetail) {
      // 组件需要的图片List
      const photoData = []
      if( photoDetail && photoDetail.length > 0) {
        photoDetail.map((item, index) => {

          return photoData.push({
            index: index,
            title: item.photoName,
            photoUrl: item.photoUrl,
            photoType: item.photoType,
            imageLinks: item.imageLinks,
            imgList: [{
              lower: item.photoUrl,
              isActive: false,
            }]
          })
        })

        photoData.sort(sortBy("photoType"))
      }

      return photoData

      function sortBy(field) {
        return function(a,b) {
          return a[field] - b[field]
        }
      }

    }

  }

  export default new Model();
