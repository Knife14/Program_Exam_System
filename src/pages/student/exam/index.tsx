import React from "react";
import { Button, Descriptions, Layout, Row, Col, Divider } from 'antd';
import { Link } from 'umi';
import { UnControlled as CodeMirror } from 'react-codemirror2';

const { Content } = Layout;

var ProNo = 1;
var problem = '1 + 2 = ?'
var content = '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。你可以按任意顺序返回答案。'
var example = '1 1';
var example_ans = '2';
var tips = '算法时间不得超过1000ms';

class Index extends React.Component {
  render() {
      return <Layout>
        <Content>
          <Descriptions title= {ProNo + "."} column={1} layout='vertical'>
            <Descriptions.Item label="问题" >{problem}</Descriptions.Item>
            {/* 问题难度 类型标签*/}
            <Descriptions.Item label="内容" >{content}</Descriptions.Item>
            <Descriptions.Item label="示例">{example} <br /> {example_ans}</Descriptions.Item>
            <Descriptions.Item label="提示">{tips}</Descriptions.Item>
            <br />
          </Descriptions>,

        </Content>
      </Layout>
  }
}

export default Index;