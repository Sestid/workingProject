import { Form, Input, Modal, InputNumber } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { number } from 'prop-types';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: { desc: string }) => void;
  handleModalVisible: () => void;
}

function onChange(value: number) {
  alert(value);
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="车辆注册"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车VIN号">
        {form.getFieldDecorator('desc1', {})(<Input placeholder="请输入车VIN号" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车型">
        {form.getFieldDecorator('desc2', {})(<Input placeholder="请输入车型" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车颜色">
        {form.getFieldDecorator('desc3', {})(<Input placeholder="请输入车颜色" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车辆优先级">
        {form.getFieldDecorator('desc4', {})(
          <InputNumber min={1} max={10} step={1} onChange={onChange} placeholder="请输入" />,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
