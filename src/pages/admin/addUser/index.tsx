import React from 'react';
import ProForm, {
  ProFormSwitch,
  ProFormText,
  ProFormRadio,
  ProFormCheckbox,
  ProFormRate,
  ProFormSelect,
  ProFormDigit,
  ProFormSlider,
  ProFormGroup,
  ProFormDigitRange,
} from '@ant-design/pro-form';
import { addUser } from '../../../services/ant-design-pro/api';

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const Demo = () => (
  <div
    style={{
      padding: 24,
    }}
  >
    <ProForm
      name="addUser_from"
    //   onValuesChange={(_, values) => {
    //     console.log(values);
    //   }}
      onFinish={async (value) => {
          let msg = await addUser(value);
          if (msg.status === 'ok') {
              alert('添加成功！');
          } else {
              alert('添加失败！');
          }
      }}
    >
      <ProFormGroup label="新建用户">
      </ProFormGroup>
      <ProFormText 
          width="md" 
          name="name" 
          label="名称" 
          rules={[{ required: true, message: '请输入用户名称！' }]}
      />
      <ProFormText.Password 
          width="md" 
          name="password" 
          label="密码" 
          rules={[{ required: true, message: '请输入用户密码！'}]}
      />
      <ProFormSelect
          width="md"
          name="identify"
          label="身份"
          valueEnum={{
            student: '学生',
            teacher: '教师',
            admin: '管理员',
          }}
          placeholder="请选择一个用户身份"
          rules={[{ required: true, message: '请选择一个用户身份！' }]}
      />
      <ProFormText
          width="md" 
          name="userID" 
          label="编号" 
          rules={[{ required: true, message: '请输入对应编号！学生（年份 - xxxx）教师（年份 - xxx（学院）- xxx）管理员（1900 - xxxx）'}]}
      />
      <ProFormSelect
          width="md" 
          name="college" 
          label="学院" 
          placeholder="学生与教师用户必填！"
          valueEnum={{
              computer: '计算机学院',
              software: '软件学院',
              others: '其他学院',
          }}
      />
      <ProFormSelect
          width="md" 
          name="major" 
          label="专业" 
          placeholder="学生用户必填！"
          valueEnum={{
            csplus: '计算机科学与技术（卓越班）',
            cs: '计算机科学与技术',
            iot: '物联网工程',
            is: '信息安全',
            others: '其他专业',
          }}
      />
    </ProForm>
  </div>
);

export default Demo;