import React, { useState, useEffect } from 'react';
import { message, Tabs, Space, Descriptions, Button, Card, Row, Col } from 'antd';
import ProTable from '@ant-design/pro-table';
import { Pie } from '@ant-design/plots'; 
import { useLocation } from 'umi';
import { getScore } from '../../../services/swagger/exam';

// 表格列配置
export type TableListItem = {
    key: number;
    name: string;
    examID: string;
    creator: string;
    status: string;
    createdTime: number;
    startTime: number;
    endTime: number;
  };

// 高级表格配置
const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名称',
      width: 100,
      dataIndex: 'name',
    },
    {
        title: '用户编号',
        width: 100,
        dataIndex: 'id',
      },
    {
      title: '异常事件',
      width: 250,
      dataIndex: 'content',
    },
    {
        title: (
          <>
            时间
          </>
        ),
        width: 100,
        key: 'since',
        dataIndex: 'time',
        valueType: 'datetime',
        sorter: (a, b) => a.startTime - b.startTime,
      },
  ];

// 表格数据项
var tableListDataSource: TableListItem[] = [];

export default () => {
    var [ScoreData, SetSData] = useState([]);
    var [TagData, SetTData] = useState([]);
    var [BasicData, SetBData] = useState({});
    var [GetStatus, SetScoreStatus] = useState('unknown');

    const location = useLocation();
    const examID = location.query['examID'].toString();
    useEffect(async () => {
        tableListDataSource.splice(0, tableListDataSource.length);

        let msg = await getScore(examID);

        if ( msg['status'] === 'get success' ) {
            SetSData(msg['data']['PScore']);
            SetTData(msg['data']['TScore']);
            SetBData(msg['data']['basic']);
            
            // 异常数据表格 
            tableListDataSource = msg['data']['Abnormal'];
            // SetAbno(msg['data']['Abnormal']);
        }
        SetScoreStatus(msg['status']);
    }, []);

    const config_pro = {
        appendPadding: 10,
        data: ScoreData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.6,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 15,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
        legend: {
            layout: 'vertical',
            position: 'left',
        },
    };

    const config_tag = {
        appendPadding: 10,
        data: TagData,
        angleField: 'value',
        colorField: 'type',
        // color: [
        //     '#6B1447', '#1D2763', '#126662', '#5D0D78', '#265C08',
        //     '#637D17', '#967510', '#963F10', '#A83410', '#E65B31',
        //     '#40E631', '#3134E6', '#E6314C', '#B0E631', '#169932'
        // ],
        radius: 0.6,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 15,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    return (
        <div>
            { GetStatus === 'get success'  && ScoreData.length > 0 && (
                <div>
                    <Descriptions 
                        title="考试基础信息"
                        bordered={true}
                        contentStyle={{
                            backgroundColor: 'white'
                        }} 
                    >
                        <Descriptions.Item label="考试名称">{BasicData['name']}</Descriptions.Item>
                        <Descriptions.Item label="考试编号">{BasicData['examID']}</Descriptions.Item>
                        <Descriptions.Item label="考试人数">{BasicData['stunums']}</Descriptions.Item>
                        <Descriptions.Item label="开始时间">{BasicData['startTime']}</Descriptions.Item>
                        <Descriptions.Item label="结束时间">
                            {BasicData['endTime']}
                        </Descriptions.Item>
                    </Descriptions>
                    <br />
                    <Row gutter={40}>
                        <Col span={50}>
                            <Card title="题目分数" style={{ height: 500, width: 720 }}>
                                <Pie {...config_pro} />
                            </Card>
                        </Col>
                        <Col span={50}>
                            <Card title="标签分数" style={{ height: 500, width: 500 }}>
                                <Pie {...config_tag} />
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Card title="异常事件">
                        <ProTable<TableListItem>
                            columns={columns}
                            request={(params, sorter, filter) => {
                                // 表单搜索项会从 params 传入，传递给后端接口。
                                console.log(params, sorter, filter);
                                return Promise.resolve({
                                data: tableListDataSource,
                                success: true,
                                });
                            }}
                            rowKey="key"
                            pagination={{
                                showQuickJumper: true,
                            }}
                            search={false}
                            dateFormatter="string"
                        />
                    </Card>
                </div>
            )}
            { GetStatus === 'get wrong'  && (
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
                            title='请求错误！'
                            description='请您检查考试当前是否完全结束？或许更多原因，请联系开发者！'
                        />
                    </Card>
                </div>
            )}
        </div>
    )
};