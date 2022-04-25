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
import { gettheExam, deleteExam } from '../../../services/swagger/exam';

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
                    // 配置按钮文本
                    searchConfig: {
                      submitText: '确认',
                    },
                    // 配置按钮的属性
                    resetButtonProps: {
                        style: {
                        // 隐藏重置按钮
                        display: 'none',
                        },
                    },
                }}
                onFinish={async (values) => {
                    values['examID'] = examID;
                    let msg = await deleteExam(values);
                    if (msg.status === 'ok') {
                        alert('删除成功！');
                    } else {
                        alert('删除失败！');
                    }
                  }}
            >
                <ProFormGroup title="删除考试">
                    <ProFormTextArea
                        readonly
                        width='xl'
                        label='考试名称： '
                        name='exname'
                        value={examData['exname']}
                    />
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
                    <ProFormTextArea
                        readonly
                        width='md'
                        label='所属课程'
                        name='course'
                        value={examData['course']}
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
                            </div>
                        )
                    })
                }
            </ProForm>
        </div>
    );
};