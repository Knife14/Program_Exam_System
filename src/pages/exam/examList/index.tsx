import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getExams } from '../../../services/swagger/exam';

// 状态数
const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'past',
};

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
    title: '考试名称',
    width: 220,
    dataIndex: 'name',
    render: (_, record) => <Link target = "_blank" to={`./changeExam?examID=${record.examID}`}>{_}</Link>,
  },
  {
    title: '状态',
    width: 70,
    dataIndex: 'status',
    valueEnum: {
      close: { text: '未开始', status: 'Default' },
      running: { text: '进行中', status: 'Processing' },
      past: { text: '已结束', status: 'Success' },
    },
  },
  {
    title: (
      <>
        开始时间
      </>
    ),
    width: 150,
    key: 'since',
    dataIndex: 'startTime',
    valueType: 'datetime',
    sorter: (a, b) => a.startTime - b.startTime,
  },
  {
    title: (
      <>
        结束时间
      </>
    ),
    width: 150,
    key: 'since',
    dataIndex: 'endTime',
    valueType: 'datetime',
    sorter: (a, b) => a.endTime - b.endTime,
  },
  {
    title: '创建者编号',
    width: 80,
    dataIndex: 'creatorID',
  },
  {
    title: '创建者姓名',
    width: 80,
    dataIndex: 'creatorName',
  },
  {
    title: '操作',
    width: 130,
    key: 'option',
    valueType: 'option',
    render: (_, record) => [
      <Link target = "_blank" to = {`./changeExam?examID=${record.examID}`}>编辑</Link>,
      <Link target = "_blank" to = {`./showExam?examID=${record.examID}`}>查阅</Link>,
      <Link target = "_blank" to = {`./invigilation?examID=${record.examID}`}>监考</Link>,
      <Link target = "_blank" to = {`./deleteExam?examID=${record.examID}`}>删除</Link>,
    ],
    tooltip: '查阅功能为查阅当场考试成绩分析',
  },
];

// 表格数据项
const tableListDataSource: TableListItem[] = [];

export default () => {

  // useEffect(async () => {
  //   tableListDataSource.splice(0, tableListDataSource.length);
    
  //   let msg = await getExams();

  //   for (let test of msg['data']) {
  //     // 判断当前状态
  //     var stime = new Date(test['startTime']);
  //     var etime = new Date(test['endTime']);
  //     var currtime = new Date();

  //     var status: any;
  //     if (currtime.getTime() < stime.getTime()) {
  //       status = 'close';
  //     } else if (currtime.getTime() > etime.getTime()) {
  //       status = 'past';
  //     } else {
  //       status = 'running';
  //     }
  //     test['status'] = status;

  //     tableListDataSource.push(test);
  //   }
  // }, []);

  return (
    <ProTable<TableListItem>
      columns={columns}
      request={ async (params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        tableListDataSource.splice(0, tableListDataSource.length);
    
        let msg = await getExams();
    
        for (let test of msg['data']) {
          // 判断当前状态
          var stime = new Date(test['startTime']);
          var etime = new Date(test['endTime']);
          var currtime = new Date();
    
          var status: any;
          if (currtime.getTime() < stime.getTime()) {
            status = 'close';
          } else if (currtime.getTime() > etime.getTime()) {
            status = 'past';
          } else {
            status = 'running';
          }
          test['status'] = status;
    
          tableListDataSource.push(test);
        }
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
        <Link target = "_blank" to="./addExam"><Button type="primary" key="primary">
          创建考试
        </Button></Link>,
      ]}
    />
  );
};