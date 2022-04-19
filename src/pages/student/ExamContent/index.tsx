import React, { useState, useEffect } from 'react';
import { message, Tabs, Space, Descriptions, Button, Card, Layout, Alert, Statistic, Row, Col, Modal } from 'antd';
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
import { stuGetExam, testProgram, testFill, exitExam, sendAbnormal } from '../../../services/swagger/exam';
import component from '@/locales/bn-BD/component';

let codeRef: any;

export default () => {
    var [examData, SetData] = useState([]);
    var [duraTime, SetTime] = useState<Number>();
    var [ExamStatus, SetExamStatus] = useState('unknown');
    var [examScore, SetScore] = useState<Number>();
    var [isModalVisible, setIsModalVisible] = useState(false);
    var [SubmitStatus, SetSubmitStatus] = useState('unknown');
    var [ProgramWrong, SetWrong] = useState('unknown');
    var [initWidth, SetWidth] = useState<Number>();

    const addr = useLocation();
    const examID = addr.query['examID'].toString();

    // 处理对话框
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);

        // 修改当前考试状态
        let msg = await exitExam(examID);
        SetExamStatus('end');
        SetScore(msg['score']);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 监听窗口变化
    var curr_abnoraml_state = '窗口正常';
    var last_abnoraml_state = '窗口正常';
    const send_abno = async (content) => {
        let data = {};
        data['examID'] = examID;
        data['type'] = 'Abnormal';
        data['content'] = content

        let msg = await sendAbnormal(data);
    }

    useEffect(async () => {
        let msg = await stuGetExam(examID);

        if ( msg['status'] === 'success' ){
            SetData(msg['data']);

            // 处理倒计时
            let duratime = Date.now() + Number(msg['duratime']) * 60 * 1000;
            SetTime(duratime);
            SetWidth(window.innerWidth);
        }
        SetExamStatus(msg['status']);
    }, []);

    return (
        <div style={{ whiteSpace: 'pre-wrap' }}>
            {/* 考试过程中禁止使用鼠标右键菜单功能，以及粘贴功能 */}
            <script>
                { document.oncontextmenu = (evt) => {
                    evt.preventDefault();
                }}
                { document.onpaste = (evt) => {
                    return false;
                }}
                { window.addEventListener = async () => {
                    if ( window.innerWidth != initWidth ) {
                        curr_abnoraml_state = '窗口变化异常';
                        if ( curr_abnoraml_state != last_abnoraml_state ) {
                            last_abnoraml_state = curr_abnoraml_state;
                            send_abno(curr_abnoraml_state);
                        }
                    } else if ( window.innerWidth == initWidth ) {
                        curr_abnoraml_state = '窗口正常';
                        if ( curr_abnoraml_state != last_abnoraml_state ) {
                            last_abnoraml_state = curr_abnoraml_state;
                            send_abno(curr_abnoraml_state);
                        }
                    }
                }}
                { window.removeEventListener = async () => {
                } }
            </script>
            { ExamStatus === 'success' && (
                <Row gutter={20} wrap={false}>
                    <Col span={20}>
                        <Tabs tabPosition='left' onChange={() => {SetSubmitStatus('unknown');}}>
                            {[...Array.from({ length: examData.length }, (v, i) => i)].map(i => (
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
                                                { examData[i]['eqType'] === '填空题' && (
                                                    <ProFormTextArea
                                                        readonly
                                                        label='分值'
                                                        name='score'
                                                        value={5}
                                                        width='xl'
                                                    />
                                                )}
                                                { examData[i]['eqType'] === '编码题' && (
                                                    <ProFormTextArea
                                                        readonly
                                                        label='分值'
                                                        name='score'
                                                        value={15}
                                                        width='xl'
                                                    />
                                                )}
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
                                                            value['tqID'] = examData[i]['eqID'];
                                                            value['examID'] = examID;
                                                            let res = await testFill(value);

                                                            if ( res['status'] === 'fill submit success') {
                                                                SetSubmitStatus('fill submit success');
                                                            } else if (res['status'] === 'fill write wrong'){
                                                                SetSubmitStatus('fill write wrong');
                                                            } else {
                                                                SetSubmitStatus('submit error');
                                                            }
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
                                                    <br />
                                                    { SubmitStatus === 'fill submit success'  &&
                                                        <div>  
                                                            <Alert style={{ width: 800}} message="提交成功" type="success" showIcon />
                                                        </div>
                                                    }
                                                    { SubmitStatus === 'fill write wrong'  &&
                                                        <div>  
                                                            <Alert style={{ width: 800}} message="答案与要求不符" type="error" showIcon />
                                                        </div>
                                                    }
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
                                                        <Button
                                                            type='primary'
                                                            style={{ textAlign: 'center' }} 
                                                            onClick={async () => {
                                                                let values = codeRef.getExamValue();
                
                                                                values['examID'] = examID;
                                                                values['tqID'] = examData[i]['eqID'];
                                                                // 调用接口
                                                                let res = await testProgram(values);

                                                                if ( res['status'] === 'program run failed') {
                                                                    SetWrong(res['content']);
                                                                }
                                                                SetSubmitStatus(res['status']);
                                                            }}
                                                        >
                                                            提交
                                                        </Button>
                                                        <br /><br />
                                                        { SubmitStatus === 'program success run' && (
                                                            <div>  
                                                                <Alert style={{ width: 800}} message="运行成功" type="success" showIcon />
                                                            </div>
                                                        )}
                                                        { SubmitStatus === 'program run failed' && (
                                                            <div>  
                                                                <Alert style={{ width: 800}} message={ProgramWrong} type="error" showIcon />
                                                            </div>
                                                        )}
                                                        { SubmitStatus === 'submit error' && (
                                                            <div>  
                                                                <Alert style={{ width: 800}} message="提交失败" type="error" showIcon />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </ProForm>
                                    </div>
                                </Tabs.TabPane>
                            ))}
                        </Tabs>
                    </Col>
                    <Col span={3} style={{ marginTop: 128 }}>
                        <Statistic.Countdown title='倒计时' value={duraTime} on Finish={() => SetExamStatus('end')}/>
                        <br /><br /><br />
                        <Button onClick={() => showModal()}>
                            结束考试
                        </Button>
                        <Modal title="是否要结束考试？" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <p>请仔细确认你的选择！一经退出，将无法再次参与考试！</p>
                        </Modal>
                    </Col>
                </Row>
            )}
            { ExamStatus === 'end' && (
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
                        title='考试结束'
                        description='您参加的这场考试，已经结束！预祝您取得理想的成绩！'
                    />
                </Card>
                <span>您的得分是： {examScore}</span>
                </div>
            )}
            { ExamStatus === 'join error' && (
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
                            title='参加错误'
                            description='请检查您是否已经参加过考试，将无法参加第二次考试！如有问题，请联系教师、管理员'
                        />
                    </Card>
                </div>
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