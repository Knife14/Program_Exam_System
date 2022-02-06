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
import { useLocation } from 'umi';
import { stuGetExam } from '../../../services/swagger/exam';

type ProList = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

var wrong = {};

const { Header, Content, Footer } = Layout;

export default () => {
    var [proList, setProList] = useState<ProList>('0');
    var [examData, SetData] = useState({});
    var [ExamStatus, SetExamStatus] = useState('success');

    const add = useLocation();
    const examID = add.query['examID'].toString();
    useEffect(async () => {
        let msg = await stuGetExam(examID);

        SetExamStatus(msg['status']);
        if ( ExamStatus === 'success' ){
            SetData(msg['data']);
        }
    }, []);

    return (
        <div>
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
            { examData != null && (
                <Tabs activeKey={proList} tabPosition='left' onChange={(activeKey) => setProList(activeKey as ProList)}>
                    {[...Array.from({ length: 10 }, (v, i) => i)].map(i => (
                        <Tabs.TabPane tab={`问题${i + 1}`} key={i}>
                            { proList === '0' && (
                                <div>
                                    哈哈
                                </div>
                            )}
                            { proList === '1' && (
                                <div>
                                    嘻嘻
                                </div>
                            )}
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            )}
        </div>
    )
};