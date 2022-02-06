import React, { useState, useEffect } from 'react';
import { message, Tabs, Space, Descriptions, Button, Card, Layout } from 'antd';
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
import Codemirror from './Codemirror';
import { useLocation } from 'umi';
import { stuGetExam, testProgram, testFill } from '../../../services/swagger/exam';

export default () => {
    var [examData, SetData] = useState([]);
    var [ExamStatus, SetExamStatus] = useState('unknown');

    const addr = useLocation();
    const examID = addr.query['examID'].toString();

    useEffect(async () => {
        let msg = await stuGetExam(examID);

        if ( msg['status'] === 'success' ){
            SetData(msg['data']);
        }
        SetExamStatus(msg['status']);
    }, []);

    // 提交编码题
    // 还要进行补充撒
    let codeRef: any;
    var submitCode = async () => {
        const values = codeRef.getExamValue();
    
        // 调用接口
        let res = await testProgram(values);
    
      };

    return (
        <div style={{ whiteSpace: 'pre-wrap'}}>
            { ExamStatus === 'success' && (
                <Tabs tabPosition='left'>
                    {[...Array.from({ length: 10 }, (v, i) => i)].map(i => (
                        <Tabs.TabPane tab={`问题${i + 1}`} key={i}>
                            <div>
                                <ProForm
                                    name="ExamContent"
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
                                    <ProForm.Group>
                                        <ProFormTextArea
                                            readonly
                                            label='试题名称'
                                            name='name'
                                            value={examData[i]['eqName']}
                                            width='xl'
                                        />
                                        <ProFormTextArea
                                            readonly
                                            label='试题编号'
                                            name='eqID'
                                            value={examData[i]['eqID']}
                                            width='xl'
                                        />
                                    </ProForm.Group>
                                    <ProFormTextArea
                                        readonly
                                        width='xl'
                                        name='content'
                                        label='试题内容'
                                        value={examData[i]['content']}
                                    />
                                    { examData[i]['eqType'] === '填空题' && (
                                        <div>
                                            <ProForm
                                                name="FillAnswers"
                                                onFinish={async (value) => {
                                                    // 还要进行补充撒
                                                    let res = await testFill(value);
                                                }}
                                            >
                                                <ProFormList
                                                    name="fanswers"
                                                    label="作答区"
                                                    tooltip='有多少段代码需要作答，则相应添加多少行。'
                                                    rules={[
                                                    {
                                                        validator: async (_, value) => {
                                                        // console.log(value);
                                                        if (value && value.length > 0) {
                                                            return;
                                                        }
                                                        throw new Error('至少要有一项！');
                                                        },
                                                    },
                                                    ]}
                                                    creatorButtonProps={{
                                                        position: 'bottom',
                                                    }}
                                                    ref={(ref) => (fillRef = ref)}
                                                >
                                                    <ProFormGroup>
                                                        <ProFormText
                                                            rules={[
                                                            {
                                                                required: true,
                                                            },
                                                            ]}
                                                            name="input"
                                                            width='xl'
                                                        />
                                                    </ProFormGroup>
                                                </ProFormList>
                                            </ProForm>
                                        </div>
                                    )}
                                    { examData[i]['eqType'] === '编码题' && (
                                        <div>
                                            <label>示例</label>
                                            {
                                                examData[i]['examples'] && examData[i]['examples'].map((example) => {
                                                    return (
                                                        <div>
                                                            <Descriptions layout="vertical">
                                                                <Descriptions.Item label="输入">{example['input']}</Descriptions.Item>
                                                                <Descriptions.Item label="输出">{example['output']}</Descriptions.Item>
                                                            </Descriptions>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <Codemirror ref={(ref) => (codeRef = ref)} />
                                            <br />
                                            <div align='center'>
                                                <Button type='primary' style={{ textAlign: 'center' }} onClick={() => submitCode()}>提交</Button>
                                            </div>
                                        </div>
                                    )}
                                </ProForm>
                            </div>
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            )}
            { ExamStatus === 'time error' && (
                // 组件布局居中
                <div align='center'>
                    <br /><br /><br /><br /><br /><br />
                    <Card
                        style={{ width: 350 }}
                        align='middle'
                        cover={
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                        }
                    >
                        <Card.Meta
                            title='时间错误'
                            description='考试不在设置时间段内，请注意检查当前时间！'
                        />
                    </Card>
                </div>
            )}
            { ExamStatus === 'error' && (
                <div align='center'>
                    <br /><br /><br /><br /><br /><br />
                    <Card
                        style={{ width: 350 }}
                        align='middle'
                        cover={
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                        }
                    >
                        <Card.Meta
                            title='未知错误'
                            description='考试发生未知错误，请联系教师、管理员或者开发者！'
                        />
                    </Card>
                </div>
            )}
        </div>
    )
};