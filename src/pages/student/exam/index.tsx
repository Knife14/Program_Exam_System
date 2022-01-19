import React from 'react';
import { Button, Descriptions, Layout, Radio } from 'antd';

import Codemirror from './Codemirror';

// 还需要做防作弊

const { Header, Content, Footer } = Layout;

const ExamName = '考试测试链接';
const ProNo = 1;
const problem = '1 + 2 = ?';
const content =
  '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。你可以按任意顺序返回答案。';
const example = '1 1';
const example_ans = '2';
const tips = '算法时间不得超过1000ms';

class Index extends React.Component {
  submitCode = () => {
    const values = this.codeRef.getExamValuse();
    alert(JSON.stringify(values));
    //这里调用接口
  };

  codeRef: any;

  render() {
    return (
      <Layout>
        {/* props会传考试名称过来，将显示到这里 */}
        <Header style={{ color: 'white', textAlign: 'center' }}>{ExamName}</Header>
        <Content>
          <br />
          {/* 
              提前存好一个列表，利用遍历来进行动态按钮输出；
              是否存在选中一个按钮，自动显示对应该页内容的前端写法？待确定。 
            */}
          <Radio.Group defaultValue="1">
            <Radio.Button value="1">1</Radio.Button>
            <Radio.Button value="2">2</Radio.Button>
            <Radio.Button value="3">3</Radio.Button>
            <Radio.Button value="4">4</Radio.Button>
          </Radio.Group>
          {/* 
              程序编码题将以这个形式显示；
              填空题的页面还没弄，等到时候合的时候一起搞吧！ 
            */}
          <Descriptions title={ProNo + '.'} column={1} layout="vertical">
            <Descriptions.Item label="问题">{problem}</Descriptions.Item>
            {/* 问题难度 类型标签 */}
            <Descriptions.Item label="内容">{content}</Descriptions.Item>
            <Descriptions.Item label="示例">
              {example} <br /> {example_ans}
            </Descriptions.Item>
            <Descriptions.Item label="提示">{tips}</Descriptions.Item>
            <br />
          </Descriptions>
          <Codemirror ref={(ref) => (this.codeRef = ref)} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <Button>上一题</Button>
          <Button onClick={this.submitCode}>提交</Button>
          <Button>下一题</Button>
        </Footer>
      </Layout>
    );
  }
}

export default Index;
