import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Tooltip, Card, Modal } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { useLocation } from 'umi';
import { getSubmits, getAbnormals, Invigilation } from '../../../services/swagger/exam';

// 处理对话框
var isModalVisible = false;
var content: any;
const showModal = () => {
    isModalVisible = true;
};

const handleOk = async () => {
    isModalVisible = false;
};

const handleCancel = () => {
    isModalVisible = false;
};

// 表格列配置
export type TableListItem_Submit = {
    name: string;
    userID: string;
    tqID: string;
    tqName: string;
    content: string;
    score: number;
    time: number;
  };
export type TableListItem_Abnormal = {
  name: string;
  userID: string;
  content: string;
  time: string;
};

// 高级表格配置
const columns_submit: ProColumns<TableListItem_Submit>[] = [
  {
    title: '用户名称',
    width: 80,
    dataIndex: 'name',
  },
  {
    title: '用户编号',
    width: 80,
    dataIndex: 'userID',
  },
  {
    title: '试题名称',
    width: 150,
    dataIndex: 'tqName',
    render: (_, record) => {return <Tooltip title={'试题编号：' + record.tqID}>{record.tqName}</Tooltip>}
  },
  {
    title: '分值',
    width: 50,
    dataIndex: 'score',
  },
  {
    title: '时间',
    width: 100,
    key: 'since',
    dataIndex: 'time',
    sorter: (a, b) => Number(new Date(a.time).toString()) - Number(new Date(b.time).toString()) ,
  },
  {
    title: '操作',
    width: 40,
    render: (_, record) => [
      <Button type='link' onClick={() => {
        isModalVisible = true;
        content = record.content;
      }}>
        详情
      </Button>,
    ],
  },
];
const columns_abnormal: ProColumns<TableListItem_Abnormal>[] = [
  {
    title: '用户名称',
    width: 65,
    dataIndex: 'name',
  },
  {
    title: '用户编号',
    width: 80,
    dataIndex: 'userID',
  },
  {
    title: '异常事件',
    width: 100,
    dataIndex: 'event',
  },
  {
    title: '时间',
    width: 100,
    key: 'since',
    dataIndex: 'time',
    sorter: (a, b) => Number(new Date(a.time).toString()) - Number(new Date(b.time).toString()),
  },
];

// 表格数据项
const tableListDataSource_Submit: TableListItem_Submit[] = [];
const tableListDataSource_Abnormal: TableListItem_Abnormal[] = [];

export default () => {
  var [curr_state, SetCurrState] = useState<string>();
  const [time_submit, setSTime] = useState(() => Date.now());
  const [time_abnormal, setATime] = useState(() => Date.now());
  const [polling_submit, setSPolling] = useState<number | undefined>(3000);
  const [polling_abnormal, setAPolling] = useState<number | undefined>(2000);

  const location = useLocation();
  const examID = location.query['examID'].toString();

  useEffect(async () => {
    tableListDataSource_Submit.splice(0, tableListDataSource_Submit.length);
    
    let msg = await Invigilation(examID);

    SetCurrState(msg['status']);
  }, []);

  return (
    <div style={{ whiteSpace: 'pre-wrap'}}>
      { curr_state === 'get success' && (
        <div style={{ whiteSpace: 'pre-wrap'}}>
              <Row gutter={200} wrap={false}>
                  <Col span={11}>
                      <Card title="提交记录" style={{ width: 650}}>
                          <ProTable<TableListItem_Submit>
                            columns={columns_submit}
                            polling={polling_submit || undefined}
                            headerTitle={`上次更新时间：${moment(time_submit).format('HH:mm:ss')}`}
                            request={ async (params, sorter, filter) => {
                              // 表单搜索项会从 params 传入，传递给后端接口。
                              let msg = await getSubmits(examID);
      
                              setSTime(Date.now());
                              return Promise.resolve({
                                data: msg['data'],
                                success: true,
                              });
                            }}
                            rowKey="key"
                            pagination={{
                              showQuickJumper: true,
                            }}
                            search={false}
                            dateFormatter="string"
                            toolBarRender={() => [
                            ]}
                          />
                      </Card>
                  </Col>
                  <Col span={10}>
                      <Card title="异常记录" style={{ width: 600}}>
                          <ProTable<TableListItem_Abnormal>
                            columns={columns_abnormal}
                            polling={polling_abnormal || undefined}
                            headerTitle={`上次更新时间：${moment(time_abnormal).format('HH:mm:ss')}`}
                            request={ async (params, sorter, filter) => {
                              // 表单搜索项会从 params 传入，传递给后端接口。
                              let msg = await getAbnormals(examID);
      
                              setATime(Date.now());
                              return Promise.resolve({
                                data: msg['data'],
                                success: true,
                              });
                            }}
                            rowKey="key"
                            pagination={{
                              showQuickJumper: true,
                            }}
                            search={false}
                            dateFormatter="string"
                            toolBarRender={() => [
                            ]}
                          />
                      </Card>
                  </Col>
            </Row>
            <Modal title='提交内容' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} style={{ whiteSpace: 'pre-wrap'}}>
                {content}
            </Modal>
          </div>
      )}
      { curr_state === 'get wrong' && (
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
                      title='不在考试时间内'
                      description='考试不在设置时间段内，请注意检查当前时间！'
                  />
              </Card>
          </div>
      )}
    </div>
  );
};