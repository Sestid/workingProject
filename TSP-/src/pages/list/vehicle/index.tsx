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

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';
import axios from 'axios';
import qs from 'qs';
import styles from './style.less';

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset-UTF-8';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      'listTableList/add' | 'listTableList/fetch' | 'listTableList/remove' | 'listTableList/update'
    >
  >;
  loading: boolean;
  listTableList: StateType;
}

interface TableListState {
  isFormShow: boolean;
  isLoginFormShow: boolean;
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listTableList,
    loading,
  }: {
    listTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listTableList,
    loading: loading.models.listTableList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    isFormShow: false,
    isLoginFormShow: false,
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '车VIN号',
      dataIndex: 'name',
    },
    {
      title: '车型',
      dataIndex: 'desc',
    },
    {
      title: '车颜色',
      dataIndex: 'callNo',
    },
    {
      title: '车辆优先级',
      dataIndex: 'status',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={this.showConfirm}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleLoginFormModalVisible(true)}>登入</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/fetch',
    });
  }
  showConfirm = () => {
    const { confirm } = Modal;
    confirm({
      title: '确定要删除此车辆信息?',
      okText: '确认',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        message.success('删除成功');
      },
    });
  }
  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listTableList/fetch',
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
      type: 'listTableList/fetch',
      payload: {},
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'listTableList/remove',
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

  handleSelectRows = (rows: TableListItem[]) => {
    console.log(rows, 'rows');
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
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
        type: 'listTableList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleFormModalVisible = (flag?: boolean) => {
    this.setState({
      isFormShow: true,
    });
  };

  handleLoginFormModalVisible = (flag?: boolean) => {
    this.setState({
      isLoginFormShow: true,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValueType) => {
    console.log(record, 'recode ---------');
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: { desc: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('注册成功');
    this.handleModalVisible();
  };

  handleUpdate = (fields: FormValueType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/update',
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

  onCancel() {
    this.setState({
      isFormShow: false,
    });
  }

  onLoginCancel() {
    this.setState({
      isLoginFormShow: false,
    });
  }

  

  async onCreate() {
    const car_id = document.querySelector('#car_id').value;
    const msgType = document.querySelector('#type').value;
    const RemoteCmd = document.querySelector('#cmd').value;
    const SpeedlimitCommand = document.querySelector('#command').value;
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

  async onLoginCreate() {
    const car_id = document.querySelector('#car_id').value;
    const msgType = document.querySelector('#type').value;
    const RemoteCmd = document.querySelector('#cmd').value;
    const SpeedlimitCommand = document.querySelector('#command').value;
  }

  render() {
    const {
      listTableList: { data },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      isFormShow,
      isLoginFormShow,
    } = this.state;
    // const menu = (
    //   <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
    //     <Menu.Item key="remove">删除</Menu.Item>
    //     <Menu.Item key="approval">批量审批</Menu.Item>
    //   </Menu>
    // );

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
                车辆注册
              </Button>
              <Button icon="plus" type="primary" onClick={() => this.handleFormModalVisible(true)}>
                表单按钮
              </Button>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>  
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
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
            title="form del"
            okText="Create"
            onCancel={() => this.onCancel()}
            onOk={() => this.onCreate()}
          >
            <Form layout="vertical">
              <Form.Item label="car_id">
                {getFieldDecorator('car_id', {
                  rules: [{ required: true, message: 'Please input the title of collection!' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="type">
                {getFieldDecorator('type')(<Input type="textarea" />)}
              </Form.Item>
              <Form.Item label="cmd">
                {getFieldDecorator('cmd')(<Input type="textarea" />)}
              </Form.Item>
              <Form.Item label="command">
                {getFieldDecorator('command')(<Input type="textarea" />)}
              </Form.Item>
            </Form>
          </Modal>
        )}
        {isLoginFormShow && (
          <Modal
            visible={isLoginFormShow}
            title="车辆登入"
            okText="确定"
            onCancel={() => this.onLoginCancel()}
            onOk={() => this.onLoginCreate()}
          >
            <Form>
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

export default Form.create<TableListProps>()(TableList);
