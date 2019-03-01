import { Http } from 'fun-plus';

class Model {
   
    getList(param) {
        return Http.post('/funwork/rental/admin/potential/customer/list', param, {
            handleError: 'all',
            showLoading: true,
        });
    }

    register(param) {
        return Http.post('funwork/rental/admin/customer/register', param, {
            handleError: 'all',
            showLoading: true,
        });
      }
    
      // 获取下拉框  
      getDiclist() {
        return Http.post('funwork/rental/admin/dic/dicList', {}, {
            handleError: 'all',
            showLoading: true,
        });
      }
    
      // 区域城市  
      getOrgList(param) {
        return Http.post('funwork/rental/admin/dic/orgList', {}, {
            handleError: 'all',
            showLoading: true,
        });
      }
    
      // 项目 
      getProjectList(param) {
        return Http.post('funwork/rental/admin/dic/projectList', param, {
            handleError: 'all',
            showLoading: true,
        });
      }
    
      // 渠道名称
      getNameList(param) {
        return Http.post('funwork/rental/admin/channel/name-list', param, {
            handleError: 'all',
            showLoading: true,
        });
      }
    
      // 新增客户单
      addCustomer(param) {
        return Http.post('funwork/rental/admin/potential/customer/add', param, {
            handleError: 'all',
            showLoading: true,
        });
      }

    // 获取详情接口
    getCustomerDetail(param) {
        return Http.post('funwork/rental/admin/potential/customer/detail', param, {
            handleError: 'all',
            showLoading: true,
        });
    }

    // 修改客户单
    modifyCustomer(param) {
        return Http.post('funwork/rental/admin/potential/customer/modify', param, {
            handleError: 'all',
            showLoading: true,
        });
    }
    
}
  
export default new Model();
