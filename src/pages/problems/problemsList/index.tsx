import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { getProblems } from '../../../services/swagger/exam';


// 表格列配置
export type TableListItem = {
    name: string;
    proid: string;
    tags: string;
    type: string;
    creator: string;
  };


// 高级表格配置
const columns: ProColumns<TableListItem>[] = [
  {
    title: '编号',
    width: 30,
    dataIndex: 'proid'
  },
  {
    title: '名称',
    width: 150,
    dataIndex: 'name',
    render: (_, record) => {
      return (
        <Link 
          target = "_blank" 
          to = {`./changeInfo?userid=${record.proid}`}
        >
          {_}
        </Link>
      );
    },
  },
  {
    title: '类型',
    width: 30,
    dataIndex: 'type'
  },
  {
    title: '标签',
    width: 80,
    dataIndex: 'tags'
  },
  {
    title: '创建者',
    width: 80,
    dataIndex: 'creator'
  },
  {
    title: '操作',
    width: 50,
    key: 'option',
    valueType: 'option',
    render: (_, record) => [
        <Link target = "_blank" to = {`./changePro?userid=${record.proid}`}>编辑</Link>,
        <Link target = "_blank" to = {`./deletePro?userid=${record.proid}`}>删除</Link>,
      ],
  },
];

// 表格数据项
const tableListDataSource: TableListItem[] = [];

export default () => {
  const actionRef = useRef<ActionType>();

  useEffect(async () => {
    let msg = await getProblems();

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
        <Link target = "_blank" to="./addProblem"><Button type="primary" key="primary">
          创建试题
        </Button></Link>,
      ]}
    />
  );
};