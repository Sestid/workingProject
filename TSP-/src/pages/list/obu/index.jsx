import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Modal,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';
import { thisExpression } from '@babel/types';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({ listObu, loading }) => ({
  listObu,
  loading: loading.models.listObu,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    isFormShow: false,
  };

  columns = [
    {
      title: 'OBU ID',
      dataIndex: 'name',
    },
    {
      title: '车VIN',
      dataIndex: 'name',//desc
    },
    {
      title: '车型',
      dataIndex: 'desc',//callNo
    },
    {
      title: '车颜色',
      dataIndex: 'callNo',//status
    },
    {
      title: '车辆优先级',
      dataIndex: 'status',//updatedAt
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={this.showConfirm}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleLoginModalVisible(true)}>登入</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listObu/fetch',
    });
  }
  showConfirm = () => {
    const { confirm } = Modal;
    confirm({
      title: '确定要删除此OBU注册服务?',
      okText: '确认',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        message.success('删除成功');
      },
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listObu/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'listObu/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'listObu/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;

      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'listObu/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  // 登入 start
  handleLoginModalVisible = () => {
    this.setState({
      isFormShow: true,
    });
  };

  onCancel() {
    this.setState({
      isFormShow: false,
    });
  }

  async onCreate() {
    const time = document.querySelector('#time').value;
    const status = document.querySelector('#status').value;
    console.log(time, 'time');
    console.log(status, 'status');
    return;
    const postValue = {
      car_id,
      msgType,
      RemoteCmd,
      SpeedlimitCommand,
    };
    const result = await axios.post(
      'http://192.168.206.194:8082/application/payload',
      qs.stringify(postValue),
      {
        headers: {
          Accept: '*/*',
          // 'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    console.log(result, 'result --------------------');
  }

  // 登录 end

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listObu/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('注册成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listObu/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });
    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      listObu: { data },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      isFormShow,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                OBU注册
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {isFormShow && (
          <Modal
            visible={isFormShow}
            title="OBU 登入"
            okText="确定"
            onCancel={() => this.onCancel()}
            onOk={() => this.onCreate()}
          >
            <Form>
              <Form.Item
                label="OBU 状态"
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 10,
                }}
              >
                <Input type="textarea" id="status" placeholder="请输入OBD状态" />
              </Form.Item>
              <Form.Item
                label="失效时间"
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 10,
                }}
              >
                <Input type="textarea" id="time" placeholder="请输入时间" />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
