import React, { useState, useEffect } from 'react';
import { message, Tabs, Space, Descriptions, Button } from 'antd';
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
    ProFormList,
    ProFormTreeSelect,
    DrawerForm,
    ProFormDateTimeRangePicker,
  } from '@ant-design/pro-form';
import { useLocation } from 'umi';
import { gettheExam, changeExam } from '../../../services/swagger/exam';

export default () => {
    let [examData, SetData] = useState({});
    let times = 0;

    const location = useLocation();
    const examID = location.query['examID'].toString();
    useEffect(async () => {
        let msg = await gettheExam(examID);

        SetData(msg['data']);
    }, []);

    return (
        <div style={{ whiteSpace: 'pre-wrap'}}>
            <ProForm
                name="changeExam"
                submitter={{
                    // 配置按钮的属性
                    resetButtonProps: {
                      style: {
                        // 隐藏重置按钮
                        display: 'none',
                      },
                    },
                    submitButtonProps: {},
                    // 完全自定义整个区域
                    render: (props, doms) => {
                      // console.log(props);
                      return [
        
                      ];
                    },
                  }}
            >
                <ProFormGroup title="编辑考试">
                    <ProFormTextArea
                        readonly
                        width='xl'
                        label='考试名称： '
                        name='exname'
                        value={examData['exname']}
                    />
                    <DrawerForm
                        title="编辑考试"
                        trigger={
                            <Button type="primary">
                            修改
                            </Button>
                        }
                        autoFocusFirstInput
                        drawerProps={{
                            forceRender: true,
                            destroyOnClose: true,
                        }}
                        onFinish={async (values) => {
                            console.log(values);

                            values['examID'] = examID;
                            let msg = await changeExam(values);
                            if (msg.status === 'ok') {
                                alert('修改成功！');
                            } else if (msg.status === 'change eqlist error') {
                                alert('修改试题列表失败！');
                            } else {
                                alert('修改失败！请检查用户身份或者当前时间，如有更多问题请联系开发者！');
                            }
                        }}
                    >
                        <ProFormText 
                            width="xl" 
                            name="eqname" 
                            label="考试名称" 
                        />
                        <ProFormDateTimeRangePicker 
                            width="xl"
                            name="datetime" 
                            label="开始截止时间" 
                        />
                        <ProFormText
                            width="xl" 
                            name="duratime" 
                            label="考试持续时间" 
                        />
                        <ProFormList
                            name="eqs"
                            label="试题"
                            creatorButtonProps={{
                                position: 'bottom',
                            }}
                            >
                            <ProFormGroup>
                                <ProFormText
                                    rules={[
                                        {
                                        required: true,
                                        },
                                    ]}
                                    name="nc_eq"
                                    width='md'
                                    label="需要修改的试题"
                                />
                                <ProFormText
                                    rules={[
                                        {
                                        required: true,
                                        },
                                    ]}
                                    name="wc_eq"
                                    width='md'
                                    label="想要插入的试题"
                                />
                            </ProFormGroup>
                        </ProFormList>
                    </DrawerForm>
                </ProFormGroup>
                <ProFormGroup>
                    <ProFormTextArea
                        readonly
                        width='md'
                        label='开始时间'
                        name='startTime'
                        value={examData['startTime']}
                    />
                    <ProFormTextArea
                        readonly
                        width='md'
                        label='结束时间'
                        name='endTime'
                        value={examData['endTime']}
                    />
                    <ProFormTextArea
                        readonly
                        width='md'
                        label='考试时间'
                        name='duraTime'
                        value={examData['duraTime']}
                        tooltip='单位：分钟'
                    />
                </ProFormGroup>
                <label >试题</label><br />
                {
                    examData['exPro'] && examData['exPro'].map((eq) => {
                        return (
                            <div>
                                <ProFormGroup 
                                    tooltip='要修改题目，只需要修改对应的试题编号即可'
                                    label={++times + '.'}
                                    key={times}
                                >
                                    <ProFormTextArea
                                        readonly
                                        width='xl'
                                        name='eqname'
                                        label='试题名称'
                                        value={eq['eqname']}
                                    />  
                                    <ProFormTextArea
                                        readonly
                                        width='md'
                                        name='eqType'
                                        label='试题类型'
                                        value={eq['eqType']}
                                    />
                                    <ProFormTextArea
                                        readonly
                                        width='md'
                                        name='eqID'
                                        label='试题编号'
                                        value={eq['eqID']}
                                    />
                                </ProFormGroup>
                                <ProFormTextArea
                                    readonly
                                    width='xl'
                                    name='content'
                                    label='试题内容'
                                    value={eq['content']}
                                />
                            </div>
                        )
                    })
                }
            </ProForm>
        </div>
    );
};