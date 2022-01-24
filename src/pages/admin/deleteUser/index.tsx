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
import { gettheUser, deleteUser } from '../../../services/ant-design-pro/api';

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
            name="deleteUser"
            onFinish={async (value) => {
                let tmp = {};
                tmp['userID'] = userData['userid'];
                console.log(tmp);

                let msg = await deleteUser(tmp);
                if (msg.status === 'ok') {
                    alert('删除成功！');
                } else {
                    alert('删除失败！');
                }
            }}
            // formRef={formRef}
            >
            <ProFormGroup label="删除用户">
                <span>姓名： {userData['name']}</span>
                <span>身份： {userData['identify']}</span>
            </ProFormGroup>
            <br />
            <ProFormGroup>
                <span>编号： {userData['userid']}</span>
            </ProFormGroup>
            <br />
            <ProFormGroup>
                <span>学院： {userData['college']}</span>
                <span>专业： {userData['major']}</span>
            </ProFormGroup>
            <br />
            <ProFormGroup>
                <span>联系方式： {userData['phone']}</span>
                <span>联系邮箱： {userData['email']}</span>
            </ProFormGroup>
            <br />
        </ProForm>
    </div>
  );
};

export default Index;