import { Http } from 'fun-plus';

class Model {
  
  getProductNames(param) {
    return Http.post('funwork/rental/admin/commodity/productNames', param, {
      handleError: 'all',
      showLoading: true,
    });
  }
    
}
  
  export default new Model();
