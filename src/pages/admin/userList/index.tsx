import React, { useState, useRef, useEffect } from 'react';
import { Button} from 'antd';
import { Link } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getUsers } from '../../../services/ant-design-pro/api';

// 表格列配置
export type TableListItem = {
    name: string;
    identify: string;
    userid: string;
    college: string;
    major: string;
  };


// 高级表格配置
const columns: ProColumns<TableListItem>[] = [
  {
    title: '用户名称',
    width: 100,
    dataIndex: 'name',
    render: (_) => <Link target = "_blank" to="">{_}</Link>,
  },
  {
    title: '身份',
    width: 80,
    dataIndex: 'identify',
  },
  {
    title: '编号',
    width: 80,
    dataIndex: 'userid'
  },
  {
    title: '学院',
    width: 80,
    dataIndex: 'college', 
  },
  {
    title: '专业',
    width: 80,
    dataIndex: 'major', 
  },
  {
    title: '操作',
    width: 100,
    key: 'option',
    valueType: 'option',
    render: () => [
      <a key="link">编辑</a>,
      <a key="link3">删除</a>,
    ],
  },
];

// 表格数据项
const tableListDataSource: TableListItem[] = [];

export default () => {
  useEffect(async () => {
    let msg = await getUsers();

    for (let user of msg['data']){
        tableListDataSource.push(user);
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
      search={{
        optionRender: false,
        collapsed: false,
      }}
      dateFormatter="string"
      toolBarRender={() => [
        <Button type="primary" key="primary">
          创建用户
        </Button>,
      ]}
    />
  );
};