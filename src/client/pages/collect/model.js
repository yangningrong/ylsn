import { Http } from 'fun-plus';

class Model {
  
  getProductType(param) {
    return Http.post('funwork/rental/admin/commodity/productType', param, {
      handleError: 'all',
      showLoading: true,
    });
  }
  
  getProductNames(param) {
    return Http.post('funwork/rental/admin/commodity/productNames', param, {
      handleError: 'all',
      showLoading: true,
    });
  }

  addContract(param) {
    return Http.post('funwork/rental/admin/commodity/addContract', param, {
      handleError: 'all',
      showLoading: true,
    });
  }
    
  }
  
  export default new Model();
