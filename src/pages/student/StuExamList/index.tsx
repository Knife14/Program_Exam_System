import React from 'react';
import { Button} from 'antd';
import { Link } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

// 表格列配置
export type TableListItem = {
    key: number;
    name: string;
    creator: string;
    status: string;
    createdAt: number;
    memo: string;
  };

// 状态数
const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'past',
};

// 高级表格配置
const columns: ProColumns<TableListItem>[] = [
  {
    title: '考试名称',
    width: 500,
    dataIndex: 'name',
    render: (_) => <Link target = "_blank" to="./exam">{_}</Link>,
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'status',
    initialValue: 'close',
    valueEnum: {
      close: { text: '未开始', status: 'Default' },
      running: { text: '进行中', status: 'Processing' },
      past: { text: '已结束', status: 'Success' },
    },
  },
  {
    title: '创建者',
    width: 80,
    dataIndex: 'creator',
  },
  {
    title: (
      <>
        创建时间
      </>
    ),
    width: 100,
    key: 'since',
    dataIndex: 'createdAt',
    valueType: 'date',
    sorter: (a, b) => a.createdAt - b.createdAt,
  },
];

// 创建者具体数据
const creators = ['开发者'];

// 表格数据项
const tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 1; i += 1) {
  tableListDataSource.push({
    key: i,
    name: '考试测试链接',
    creator: creators[Math.floor(Math.random() * creators.length)],
    status: valueEnum[Math.floor(Math.random() * 10) % 3],
    createdAt: Date.now() - Math.floor(Math.random() * 100000),
    memo: i % 2 === 1 ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴' : '简短备注文案',
  });
}

export default () => {
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
    />
  );
};