import React, { useState, useEffect, useRef }from 'react';
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
  FormInstance,
} from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { useLocation } from 'umi';
import { gettheUser, changeUser } from '../../../services/ant-design-pro/api';

export const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
};

const Index = () => {
  let [userData, SetData] = useState({});
  const location = useLocation();
  const userID = location.query['userid'].toString();

  const formRef = useRef<
    ProFormInstance<{
      name: string;
      userid: string;
      identify: string;
      password: string;
      major: string;
      college: string;
      email: string;
      phone: string;
    }>
  >();

  useEffect(async () => {
    var msg = await gettheUser(userID);

    SetData(msg['data']);

    // formRef.current?.setFieldsValue(userData);
  }, []);

  // const FormRef = useRef<FormInstance>(null);


    // 'name': userData['name'],
    // 'identify': userData['access'],
    // 'phone': userData['phone'],
    // 'email': userData['email'],
    // 'password': userData['password'],
    // 'userid': userData['userid'],
  return (
    <div
        style={{
        padding: 24,
        }}
    >
        <ProForm
            name="changeInfo"
            onFinish={async (value) => {
                let msg = await changeUser(value);
                if (msg.status === 'ok') {
                    alert('编辑成功！');
                } else {
                    alert('编辑失败！');
                }
            }}
            formRef={formRef}
            >
            <ProFormGroup label="编辑用户">
            </ProFormGroup>
            <ProFormText 
                width="md" 
                name="name" 
                label="名称" 
                // value={userData['name']}
                rules={[{ required: true, message: '请输入用户名称！' }]}
            />
            <ProFormText.Password
                width="md" 
                name="password" 
                label="密码" 
                // value={userData['password']}
                rules={[{ required: true, message: '请输入用户密码！'}]}
                tooltip="默认初始密码为：123456"
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
                // value={userData['access']}
                placeholder="请选择一个用户身份"
                rules={[{ required: true, message: '请选择一个用户身份！' }]}
            />
            <ProFormText
                width="md" 
                name="userID" 
                label="编号" 
                // value={userData['userid']}
                rules={[{ required: true, message: '请输入对应编号！'}]}
                tooltip="学生（年份 - xxxx）教师（年份 - xxx（学院）- xxx）管理员（1900 - xxxx）"
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
                // value={userData['college']}

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
                // value={userData['major']}

            />
            <ProFormText
                width="md" 
                name="phone" 
                label="联系方式" 
                // value={userData['phone']}

            />
            <ProFormText
                width="md" 
                name="email" 
                label="联系邮箱" 
                // value={userData['email']}

            />
        </ProForm>
    </div>
  );
};

export default Index;