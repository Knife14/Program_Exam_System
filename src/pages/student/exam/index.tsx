import React from "react";
import { Button, Descriptions, Layout, Radio } from 'antd';
import { Link } from 'umi';

// 专门的代码编辑组件
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js';

// 还需要做防作弊

const { Header, Content, Footer } = Layout;

var ExamName = '考试测试链接';
var ProNo = 1;
var problem = '1 + 2 = ?'
var content = '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。你可以按任意顺序返回答案。'
var example = '1 1';
var example_ans = '2';
var tips = '算法时间不得超过1000ms';

class Index extends React.Component {
  render() {
      return (
        <Layout>
          { /* props会传考试名称过来，将显示到这里 */}
          <Header style = {{ color: 'white', textAlign: 'center'} }>
            {ExamName}
          </Header>
          <Content>
            <br />
            { /* 
              提前存好一个列表，利用遍历来进行动态按钮输出；
              是否存在选中一个按钮，自动显示对应该页内容的前端写法？待确定。 
            */}
            <Radio.Group defaultValue="1">
              <Radio.Button value="1">1</Radio.Button>
              <Radio.Button value="2">2</Radio.Button>
              <Radio.Button value="3">3</Radio.Button>
              <Radio.Button value="4">4</Radio.Button>
            </Radio.Group>
            { /* 
              程序编码题将以这个形式显示；
              填空题的页面还没弄，等到时候合的时候一起搞吧！ 
            */}
            <Descriptions title= {ProNo + "."} column={1} layout='vertical'>
              <Descriptions.Item label="问题" >{problem}</Descriptions.Item>
              { /* 问题难度 类型标签 */}
              <Descriptions.Item label="内容" >{content}</Descriptions.Item>
              <Descriptions.Item label="示例">{example} <br /> {example_ans}</Descriptions.Item>
              <Descriptions.Item label="提示">{tips}</Descriptions.Item>
              <br />
            </Descriptions>
            <CodeMirror
              value=''
              options={{
                lineNumbers: true,  // 是否在编辑器左侧显示行号
                mode: {
                  name: "text/x-csrc",
                  name: "text/x-c++src",
                  name: "text/x-cython",
                },  // 自动适配语言
                extraKeys: {"Ctrl": "autocomplete"},  // ctrl + 空格 自动提示配置
                autofocus: true,  // 自动获取焦点
                styleActiveLine: true,  // 光标行代码高亮
                lineWarpping: true,  // start-设置支持代码折叠
                foldGutter: true,
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
              }}
            />
          </Content>
          <Footer style={{ textAlign: 'center'}}>
            <Button>上一题</Button>
            <Button>提交</Button>
            <Button>下一题</Button>
          </Footer>
        </Layout>
      );
  }
}

export default Index;