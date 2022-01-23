import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
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
    title: '名称',
    width: 100,
    dataIndex: 'name',
    render: (_, record) => {
      return (
        <Link 
          target = "_blank" 
          to = {`./changeInfo?userid=${record.userid}`}
        >
          {_}
        </Link>
      );
    },
  },
  {
    title: '身份',
    width: 80,
    dataIndex: 'identify',
    filters: [
      { text: '学生', value: 'student' },
      { text: '教师', value: 'teacher' },
      { text: '管理员', value: 'admin' },
    ],
    onFilter: (value, record) => record.identify == value,
    render: (identify) => {
      if (identify === 'student')
        return <p>学生</p>
      else if (identify === 'teacher')
        return <p>教师</p>
      else if (identify === 'admin')
        return <p>管理员</p>
    },
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
    filters: [
      { text: '计算机学院', value: '计算机学院' },
      { text: '软件学院', value: '软件学院' },
      { text: '其他学院', value: '其他学院' },
    ],
    onFilter: (value, record) => record.college == value,
  },
  {
    title: '专业',
    width: 100,
    dataIndex: 'major', 
    filters: [
      { text: '计算机科学与技术（卓越班）', value: '计算机科学与技术（卓越班）' },
      { text: '物联网工程', value: '物联网工程' },
      { text: '计算机科学与技术', value: '计算机科学与技术' },
      { text: '信息安全', value: '信息安全' },
    ],
    onFilter: (value, record) => record.major == value,
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
  const actionRef = useRef<ActionType>();

  useEffect(async () => {
    let msg = await getUsers();

    for (let user of msg['data']){
        tableListDataSource.push(user);
    }
  }, []);

  return (
    <ProTable<TableListItem>
      columns={columns}
      actionRef={actionRef}
      request={(params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
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
        <Link target = "_blank" to="./addUser"><Button type="primary" key="primary">
          创建用户
        </Button></Link>,
      ]}
    />
  );
};