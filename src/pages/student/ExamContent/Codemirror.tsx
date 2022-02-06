import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Select, notification } from 'antd';
import { Controlled as CodeMirror } from 'react-codemirror2';

// 引入codemirror核心css,js文件（经试验css必须有，js文件还没发现它的用处）
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror.js';

// 引入 ambiance 主题
import 'codemirror/theme/ambiance.css';

//ctrl+空格代码提示补全
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint.js';
//代码高亮
import 'codemirror/addon/selection/active-line';
//折叠代码
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js';

const { Option } = Select;

const CodeMirrorBox = forwardRef((props, ref) => {
  const [code, setCode] = useState('');
  const [setting, setSetting] = useState({
    type: 'Python',
    mode: 'text/x-python',
  });

  const changeCode = (test, changeObj, value) => {
    setCode(value);
  };

  const handleChange = (value: any) => {
    let param = { type: 'Python', mode: 'text/x-python' };
    if (value == 'C') {
      param = { type: 'C', mode: 'text/x-csrc' };
    }
    setCode('');
    setSetting({
      ...setting,
      ...param,
    });
  };

  const handleSubmit = () => {
    if (!code) {
      notification['error']({
        message: '请编写代码提交',
      });
      return;
    }
    return { code, type: setting.type };
  };

  useImperativeHandle(ref, () => ({
    getExamValue: () => handleSubmit(),
  }));

  return (
    <div style={{ width: '100%' }}>
      <div style={{ margin: '10px 0 10px 20px' }}>
        <span>选择语言</span>{' '}
        <Select defaultValue="Python" style={{ width: 120 }} onChange={handleChange}>
          <Option value="Python">Python</Option>
          <Option value="C">C</Option>
        </Select>
      </div>
      <CodeMirror
        value={code}
        options={{
          // text/x-csrc
          // text/x-cython
          //text/x-python
          mode: setting.mode,
          // theme: 'leetcode',
          theme: 'ambiance',
          lineNumbers: true,
          highlightMatches: true,
          smartIndent: true,
          indentUnit: 4,
          indentWithTabs: true,
          lineWrapping: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
          foldGutter: true,
          autofocus: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          styleActiveLine: true,
        }}
        onBeforeChange={changeCode}
      />
    </div>
  );
});

export default CodeMirrorBox;
