import React, { useState } from 'react';
import { message, Tabs, Space } from 'antd';
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
    ProFormTextArea,
  } from '@ant-design/pro-form';
import { addProblem } from '../../../services/swagger/exam';
import Codemirror from './Codemirror';

type ProType = '填空题' | '编码题';

export default () => {
  const [proType, setProType] = useState<ProType>('填空题');

  let codeRef: any;

  return (
    <div>
      <ProForm
        name="addUser_from"
        onFinish={async (value) => {
            // test
            // let send_data = value;
            // send_data['type'] = proType; 
            console.log(value);

            // let msg = await addProblem(value);
            // if (msg.status === 'ok') {
            //     alert('添加成功！');
            // } else {
            //     alert('添加失败！');
            // }
        }}
      >
        <ProFormGroup label="新建试题">
        </ProFormGroup>
        <Tabs activeKey={proType} onChange={(activeKey) => setProType(activeKey as ProType)}>
          <Tabs.TabPane key={'填空题'} tab={'填空题'} />
          <Tabs.TabPane key={'编码题'} tab={'编码题'} />
        </Tabs>
        {proType === '填空题' && (
          <>
            <ProFormText 
                width="lg" 
                name="name" 
                label="名称" 
                rules={[{ required: true, message: '请输入题目名称！' }]}
            />
            <ProFormText
                width="lg"
                name="tags"
                label="标签"
                tooltip='多个标签以"；"或";"间隔'
            />
            <ProFormText
                width="lg"
                name="content"
                label="内容"
                rules={[{ required: true, message: '请输入题目内容！' }]}
            />
            <Codemirror ref={(ref) => (codeRef = ref)} /><br />
            <ProFormText
                width="lg" 
                name="answer" 
                label="答案" 
                rules={[{ required: true, message: '填空题必须填答案！'}]}
            />
            <br /><br />
          </>
        )}
        {proType === '编码题' && (
          <>
            <span>哈哈</span>
            <br /><br />
          </>
        )}
      </ProForm>
    </div>
  );
};