import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Modal, Descriptions } from 'antd';
import { Link } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useLocation } from 'umi';
import { getRecord, deleteRecord } from '../../../services/swagger/exam';

// 状态数
const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'past',
};

// 表格列配置
export type TableListItem = {
    name: string;
    userID: string;
    examName: string;
    examID: string;
    eventType: string;
    event ?: string;
    content ?: string;
    tname ?: string;
    time: string;
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
    dataIndex: 'userID',
  },
  {
    title: '考试名称',
    width: 200,
    dataIndex: 'ename',
  },
  {
    title: '考试编号',
    width: 100,
    dataIndex: 'examID',
  },
  {
    title: '事件类型',
    width: 100,
    dataIndex: 'eventType',
    filters: [
        { text: '提交', value: '提交' },
        { text: '异常', value: '异常' },
        { text: '参加', value: '参加' },
        { text: '结束', value: '结束' },
      ],
    onFilter: (value, record) => record.eventType == value,
  },
  {
    title: '事件内容',
    width: 200,
    dataIndex: 'event',
  },
  {
    title: '提交题目',
    width: 150,
    dataIndex: 'tname',
    render: (_, record) => <Tooltip title={record.content} style={{ whiteSpace: 'pre-wrap'}}>{record.tname}</Tooltip>
  },
  {
    title: '时间',
    width: 150,
    dataIndex: 'time',
  }
];

// 表格数据项
const tableListDataSource: TableListItem[] = [];

export default () => {
  var [isModalVisible, setIsModalVisible] = useState(false);
  var [basicData, SetBasicData] = useState({});

  const location = useLocation();
  const examID = location.query['examID'].toString();
  const userID = location.query['userID'].toString();

  // 处理对话框
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
      setIsModalVisible(false);

      // 修改当前考试状态
      let send = {'userID': userID, 'examID': examID};
      let msg = await deleteRecord(send);

  };

  const handleCancel = () => {
      setIsModalVisible(false);
  };

  useEffect(async () => {
    tableListDataSource.splice(0, tableListDataSource.length);

    let send = {'userID': userID, 'examID': examID};
    let msg = await getRecord(send);

    SetBasicData(msg['basic']);
    for (let data of msg['data']) {
      tableListDataSource.push(data);
    }
  }, []);


  return (
        <div style={{ whiteSpace: 'pre-wrap'}}>
            <Descriptions 
                title='基础信息' 
                bordered={true}
                contentStyle={{
                    backgroundColor: 'white'
                }} 
            >
                <Descriptions.Item label='用户姓名'>{basicData['name']}</Descriptions.Item>
                <Descriptions.Item label='用户编号'>{basicData['userID']}</Descriptions.Item>
                <Descriptions.Item label='考试名称'>{basicData['ename']}</Descriptions.Item>
                <Descriptions.Item label='考试编号'>{basicData['examID']}</Descriptions.Item>
                <Descriptions.Item label='用户成绩'>{basicData['score']}</Descriptions.Item>
            </Descriptions>
            <br />
            <ProTable<TableListItem>
            columns={columns}
            request={ async (params, sorter, filter) => {
                // 表单搜索项会从 params 传入，传递给后端接口。
                // console.log(params, sorter, filter);

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
            toolBarRender={() => [
              <Button type="primary" key="primary" onClick={showModal}>
                删除记录
              </Button>,
            ]}
            />
            <Modal title="是否删除该用户的考试记录？" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>请仔细确认你的选择！一经删除，无法恢复！</p>
            </Modal>
        </div>
  );
};