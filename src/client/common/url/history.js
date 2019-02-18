/**
 * react-router 之前的版本中，代码控制页面跳转可以通过如下的方式：
 *  - import browserHistory from 'react-router';
 *  - browserHistory.push('/xxx');
 * 
 * 但在 react-router V4 的版本中，这种方式不可用了，可以使用如下的方式：
 *  - 1、withRouter （组建外无法使用）
 *  - 2、context （react 16 中不推荐使用 context）
 *  - 3、使用 react-router 中的 Router 而非 BrowserRouter，同时传人 history 参数（本质上和使用 BrowserRouter 是一样的，
 *       BrowserRouter 内部也是通过 history 库中的 createBrowserHistory 来绑定 history 参数的）
 *
 * 本处使用第三种方式。此处通过 history 库中的 createBrowserHistory 方法取到 history 对象并导出，作为全局唯一的 history（history 可能会变化，
 * 需要通过这种方式来保证 history 的唯一性），在项目的路由处，请使用 react-router 中的 Router 而非 BrowserRouter，同时将此处导出的 history 
 * 对象作为 Router 的 history 参数传人。
 * 此方案参照如下：
 * https://stackoverflow.com/questions/42672842/how-to-get-history-on-react-router-v4?answertab=votes#tab-top
 */

import { createBrowserHistory } from 'history';

export default createBrowserHistory();
