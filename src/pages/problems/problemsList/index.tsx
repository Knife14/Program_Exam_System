import React, { useState, useRef, useEffect } from 'react';
import { Button, Tag } from 'antd';
import { Link } from 'umi';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { getProblems } from '../../../services/swagger/exam';
import { render } from 'react-dom';


// 表格列配置
export type TableListItem = {
    name: string;
    proid: string;
    tags: string;
    type: string;
    creator: string;
    creatorname: string;
    difficulty: string;
  };


// 高级表格配置
const columns: ProColumns<TableListItem>[] = [
  {
    title: '编号',
    width: 15,
    dataIndex: 'proid'
  },
  {
    title: '名称',
    width: 300,
    dataIndex: 'name',
    render: (_, record) => {
      return (
        <Link 
          target = "_blank" 
          to = {`./changePro?proid=${record.proid}`}
        >
          {_}
        </Link>
      );
    },
  },
  {
    title: '类型',
    width: 50,
    dataIndex: 'type',
    filters: [
      { text: '填空题', value: '填空题' },
      { text: '编码题', value: '编码题' },
    ],
    onFilter: (value, record) => record.type == value,
  },
  {
    title: '难度',
    width: 50,
    dataIndex: 'difficulty',
    filters: [
      { text: '简单', value: '简单' },
      { text: '中等', value: '中等' },
      { text: '困难', value: '困难' },
    ],
    onFilter: (value, record) => record.difficulty == value,
  },
  {
    title: '标签',
    key: "tags",
    width: 100,
    dataIndex: 'tags',
    render: (_, record) => {
      let re = [];
      
      for (let tag of _) {
        tag = tag.slice(1, tag.length - 1);
        re.push(<Tag>{tag}</Tag>);
      }

      return re;
    },
  },
  {
    title: '创建者',
    width: 50,
    dataIndex: 'creator'
  },
  {
    title: '创建者姓名',
    width: 70,
    dataIndex: 'creatorname'
  },
  {
    title: '操作',
    width: 80,
    key: 'option',
    valueType: 'option',
    render: (_, record) => [
        <Link target = "_blank" to = {`./changePro?proid=${record.proid}`}>编辑</Link>,
        <Link target = "_blank" to = {`./deletePro?proid=${record.proid}`}>删除</Link>,
      ],
  },
];

// 表格数据项
const tableListDataSource: TableListItem[] = [];

export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<TableListItem>
      columns={columns}
      actionRef={actionRef}
      request={ async (params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        tableListDataSource.splice(0, tableListDataSource.length);

        let msg = await getProblems();

        for (let pro of msg['data']){
          // 去除空格
          const reg = /\s+/g;
          var tags = pro['tags'].replace(reg,'');
    
          // string -> list 中文字符串无法使用json进行快速转换
          tags = tags.slice(1, tags.length - 1).split(",");
    
          pro['tags'] = tags;
          tableListDataSource.push(pro);
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
        <Link target = "_blank" to="./addProblem"><Button type="primary" key="primary">
          创建试题
        </Button></Link>,
      ]}
    />
  );
};