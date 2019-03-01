import { Http } from 'fun-plus';

class Model {
    // 获取详情接口
    getCustomerDetail(param) {
        return Http.post('funwork/rental/admin/potential/customer/detail', param, {
            handleError: 'all',
            showLoading: true
        });
    }

    //关闭原因接口 
    closeCustomerReason(param) {
        return Http.post('funwork/rental/admin/potential/customer/close-customer', param, {
            handleError: 'all',
            showLoading: true
        });
    }

    //开启客户单   
    openCustomerReason(param) {
        return Http.post('funwork/rental/admin/potential/customer/open-customer', param, {
            handleError: 'all',
            showLoading: true
        });
    }

    // 获取下拉框  
    getDiclist(param) {
        return Http.post('funwork/rental/admin/dic/dicList',param, {
            handleError: 'all',
            showLoading: true
        });
    }


}

export default new Model();
