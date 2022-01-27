import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { getUsers, deleteUser } from '../../../services/ant-design-pro/api';

// 删除用户
const letDelete = async (userid) =>{
  console.log(userid);
  // let msg = await deleteUser(userid);

  // if (msg.status === 'ok') {
  //   alert('编辑成功！');
  // } else {
  //   alert('编辑失败！');
  // }
};

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
        return '学生'
      else if (identify === 'teacher')
        return '教师'
      else if (identify === 'admin')
        return '管理员'
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
    width: 50,
    key: 'option',
    valueType: 'option',
    render: (_, record) => [
        <Link target = "_blank" to = {`./changeInfo?userid=${record.userid}`}>编辑</Link>,
        <Link target = "_blank" to = {`./deleteUser?userid=${record.userid}`}>删除</Link>,
      ],
  },
];

// 表格数据项
const tableListDataSource: TableListItem[] = [];

export default () => {
  const actionRef = useRef<ActionType>();

  useEffect(async () => {
    tableListDataSource.splice(0, tableListDataSource.length);

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