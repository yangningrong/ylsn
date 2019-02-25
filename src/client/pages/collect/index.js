import React from 'react';

import model from './model';
import { Components } from 'fun-plus';
import FunPicker from '../../components/fun-picker';

import './style.scss';

const { BasePage, Header, Layout, Link, Icon, TextInput, Footer, Button } = Components;

let typeOptions = [{
  options: [{
    label: "房间",
    value: "1"
  }, {
    label: "工房",
    value: "2"
  }],
}];

export default class Collect extends BasePage {
  constructor(props) {
    super(props);

    this.state = {
      type: '',
      typeOptions: [{ options: [] }],
      projectName: '',
    };

    // 在constructor里面创建一个引用
    this.typePickerRef = React.createRef();
  }

  componentWillMount() {

  }

  showPicker() {
    if (this.typePickerRef.current) {
      this.typePickerRef.current.show();
    }
  }

  onChangeType(value) {
    this.setState({
      type: value
    })
  }

  getList = () => {
    let param = { "projectId": "587", "productTypeId": "21" };

    model.getProductNames(param)
      .then((res) => {

      }).catch((e) => {

      });
  }

  onInput() { }

  getType = (value) => {
    const [{ options }] = typeOptions;
    return options.filter(item => item.value == value).length > 0 && options.filter(item => item.value == value)[0].label
  }
  goContract = () => {

  }
  cancle = () => {
    this.back();
  }
  render() {
    const { type, projectName } = this.state;


    return (
      <Layout className="collect-page">

        {/* Header 区域 */}
        <Header className="collect-header" showLine={false}>
          添加合约商品
        </Header>

        {/* 内容区域 */}
        <section className="collect-box">
          <div className="collect-input">
            <FunPicker title={'空间类型'} ref={this.typePickerRef} data={typeOptions} onChange={this.onChangeType.bind(this)} />
            <Link className="line-bottom" onClick={this.showPicker.bind(this)}>
              <span className="require">*</span>
              <span className="selector-label">空间类型</span>
              <span className={this.getType(type) ? "right selected" : 'right'}>{this.getType(type) || '选择空间类型'}
                <Icon icon="angle-down" />
              </span>
            </Link>
          </div>
          <div className="collect-content line-bottom">
            {/* 输入框 */}
            <TextInput
              placeholder="请输入空间名称"
              label="空间内容"
              required
              value={projectName}
              onChange={(value) => {this.onInput('projectName', value)}}
               />
          </div>
        </section>

        {/* 底部按钮 区域 */}
        <Footer className="btn-box">
          <Button className="cancle-btn" onClick={this.cancle}>
            取消
          </Button>
          <Button className="save-btn" type="primary" onClick={this.getList}>
            确定
          </Button>
        </Footer>

      </Layout>
    );
  }
}
