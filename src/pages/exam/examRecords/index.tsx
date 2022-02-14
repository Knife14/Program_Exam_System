import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getRecords } from '../../../services/swagger/exam';

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
    dataIndex: 'examName',
  },
  {
    title: '考试编号',
    width: 100,
    dataIndex: 'examID',
  },
  {
    title: '操作',
    width: 50,
    key: 'option',
    valueType: 'option',
    render: (_, record) => [
      <Link target = "_blank" to = {`./examRecord?examID=${record.examID}&userID=${record.userID}`}>详情</Link>,
    ],
    tooltip: '查阅功能为查阅当场考试成绩分析',
  },
];

// 表格数据项
const tableListDataSource: TableListItem[] = [];

export default () => {

  useEffect(async () => {
    tableListDataSource.splice(0, tableListDataSource.length);
    
    let msg = await getRecords();

    for (let data of msg['data']) {
        tableListDataSource.push(data);
    }
  }, []);

  return (
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
      toolBarRender={() => [
      ]}
    />
  );
};