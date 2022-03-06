import React, { useState, useRef, useEffect } from 'react';
import { Button, Tag } from 'antd';
import { Link } from 'umi';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { getAudits } from '../../../services/swagger/exam';
import { render } from 'react-dom';


// 表格列配置
export type TableListItem = {
    name: string;
    tqID: string;
    tags: string;
    difficulty: string;
    limits: string;
    state: string;
  };

// 状态数
const valueEnum = {
    0: 'unknown',
    1: 'passed',
    2: 'failed',
  };


// 高级表格配置
const columns: ProColumns<TableListItem>[] = [
  {
    title: '名称',
    width: 300,
    dataIndex: 'name',
    render: (_, record) => {
      return (
        <Link 
          target = "_blank" 
          to = {`./gettheAudit?tqid=${record.tqID}`}
        >
          {_}
        </Link>
      );
    },
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
    title: '限制条件',
    key: "tags",
    width: 100,
    dataIndex: 'limits',
    render: (_, record) => {
      let re = [];
      
      for (let lim of _) {
        re.push(<Tag>{lim}</Tag>);
      }

      return re;
    },
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
    title: '状态',
    width: 70,
    dataIndex: 'state',
    valueEnum: {
      unknown: { text: '未审核', status: 'Default' },
      passed: { text: '已通过', status: 'Success' },
      failed: { text: '未通过', status: 'Error' },
    },
  },
  {
    title: '操作',
    width: 80,
    key: 'option',
    valueType: 'option',
    render: (_, record) => [
        <Link target = "_blank" to={`./gettheAudit?tqid=${record.tqID}`}>详情</Link>,
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

        let msg = await getAudits();

        // 处理数据
        for (let pro of msg['data']){
          console.log(pro);
          // 处理标签，去除空格
          const reg = /\s+/g;
          var tags = pro['tags'].replace(reg,'');
    
          // string -> list 中文字符串无法使用json进行快速转换
          tags = tags.slice(1, tags.length - 1).split(",");
          pro['tags'] = tags;

          // 处理审核状态
          if ( pro['state'] === 0) {
              pro['state'] = 'unknown';
          } else if ( pro['state'] === 1 ) {
              pro['state'] = 'passed';
          } else if ( pro['state'] === 2 ) {
              pro['state'] = 'failed';
          }

          // 处理限制条件
          var limits = pro['limits'].replace(/\'/g, "\"");
          limits = JSON.parse(limits);
          pro['limits'] = limits;

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
      ]}
    />
  );
};