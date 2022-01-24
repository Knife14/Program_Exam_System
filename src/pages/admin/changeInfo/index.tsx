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
  ProFormContext,
} from '@ant-design/pro-form';
import { Tooltip } from 'antd';
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
  }, []);

  return (
    <div
        style={{
        padding: 24,
        }}
    >
        <ProForm
            name="changeInfo"
            onFinish={async (value) => {
                value['userID'] = userData['userid'];
                // console.log(value);

                let msg = await changeUser(value);
                if (msg.status === 'ok') {
                    alert('编辑成功！');
                } else {
                    alert('编辑失败！');
                }
            }}
            // formRef={formRef}
            >
            <ProFormGroup label="编辑用户">
            </ProFormGroup>
            <ProFormText 
                width="md" 
                name="name" 
                label={"名称：" + userData['name']}
                // value={userData['name']}
                // rules={[{ required: true, message: '请输入用户名称！' }]}
            />
            <ProFormText.Password
                width="md" 
                name="password" 
                label={"密码：" + userData['password']}
                // value={userData['password']}
                // rules={[{ required: true, message: '请输入用户密码！'}]}
                tooltip="默认初始密码为：123456"
            />
            <ProFormGroup>
              <Tooltip title="一般情况下无法修改用户身份，若升学、学生转教职工，可以新增一条用户记录">
                <span>身份： {userData['identify']}<br /><br /></span>
              </Tooltip>
              <Tooltip title="一般情况下无法修改用户编号，若升学、学生转教职工，可以新增一条用户记录">
                <span>编号： {userData['userid']}<br /><br /></span>
              </Tooltip>
            </ProFormGroup>
            <ProFormSelect
                width="md" 
                name="college" 
                label={"学院： " + userData['college']}
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
                label={"专业： " + userData['major']}
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
                label={"联系方式： " + userData['phone']}
                // value={userData['phone']}

            />
            <ProFormText
                width="md" 
                name="email" 
                label={"联系邮箱： " + userData['email']}
                // value={userData['email']}

            />
        </ProForm>
    </div>
  );
};

export default Index;