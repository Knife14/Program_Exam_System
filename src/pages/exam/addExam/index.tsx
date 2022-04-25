import React, { useState } from 'react';
import { DatePicker, Space } from 'antd';
import ProForm, {
    ProFormSwitch,
    ProFormText,
    ProFormRadio,
    ProFormCheckbox,
    ProFormRate,
    ProFormSelect,
    ProFormDigit,
    ProFormSlider,
    ProFormGroup,
    ProFormDigitRange,
    ProFormTextArea,
    ProFormList,
    ProFormDateTimeRangePicker,
    BetaSchemaForm,
  } from '@ant-design/pro-form';
import { addExam } from '../../../services/swagger/exam';

type TestType = '快速组卷' | '范围组卷' | '自定义组卷';
type DataItem = {
    tag: string;
    nums: string;
  };

export default () => {
  const [testType, setTestType] = useState<TestType>('快速组卷');

  const tags_list = [
    '数组', '字符串', '排序', '矩阵', '模拟', '枚举', '字符串匹配', 
    '桶排序', '计数排序', '基数排序', '动态规划', '深度优先搜索', 
    '广度优先搜索', '贪心', '二分查找', '回溯', '递归', '分治', 
    '记忆化搜索', '归并排序', '快速选择', '哈希表', '树', '二叉树', 
    '栈', '堆(优先队列)', '图', '链表', '二叉搜索树', '单调栈', 
    '有序集合', '队列', '拓扑排序', '最短路', '单调队列', '双向链表', 
    '欧拉回路', '强连通分量', '双连通分量', '并查集', '字典树', '线段树',
    '树状数组', '后缀数组', '双指针', '位运算', '前缀和', '滑动窗口', 
    '计数', '状态压缩', '哈希函数', '滚动哈希', '扫描线', '数学', 
    '几何博弈', '组合数学', '随机化', '数论', '概率与统计', '水塘抽样', 
    '拒绝采样', '数据库设计', '数据流', '交互', '脑筋急转弯', '迭代器', 
    '多线程', 'Shell', '其他'
  ];
  var tagEnum = {};
  for (let tag of tags_list){
    tagEnum[tag] = {text: tag};
  }

  var diffEnum = {};
  diffEnum['简单'] = {text: '简单'};
  diffEnum['中等'] = {text: '中等'};
  diffEnum['困难'] = {text: '困难'};

  var typeEnum = {};
  typeEnum['填空题'] = {text: '填空题'};
  typeEnum['编码题'] = {text: '编码题'};

  return (
    <div>
      <ProForm
        name="addPro_from"
        onFinish={async (value) => {
            // test
            // let send_data = value;
            // send_data['type'] = testType; 
            // console.log(value);

            // value['Type'] = proType;
            let msg = await addExam(value);
            if (msg.status === 'ok') {
                alert('添加成功！');
            } else if (msg.status === 'num error') {
                alert('试题数目出错！请按照规定，出题数确保为10题！');
            } else {
                alert('添加失败！');
            } 
        }}
        onValuesChange={(_, values) => {
            if (values['type'] === '范围组卷') {
                setTestType('范围组卷');
            } else if (values['type'] === '快速组卷') {
                setTestType('快速组卷');
            } else if (values['type'] === '自定义组卷') {
                setTestType('自定义组卷');
            }
        }}
      >
        <ProFormGroup label="新建考试">
        </ProFormGroup>
        <ProFormText 
            width="xl" 
            name="name" 
            label="考试名称" 
            rules={[{ required: true, message: '请输入考试名称！' }]}
        />
        <ProFormSelect 
            width="xl" 
            name="course" 
            label="所属课程" 
            valueEnum={{
                'C++': 'C++',
                'Python': 'Python',
            }}
        />
        <ProFormDateTimeRangePicker 
            width="xl"
            name="datetime" 
            label="开始截止时间" 
            rules={[{ required: true, message: '请输入考试开始截止时间！' }]}
        />
        <ProFormText
            width="xl" 
            name="duratime" 
            label="考试持续时间" 
            rules={[{ required: true, message: '请输入考试持续时间！' }]}
            tooltip="以分钟为单位，如考试时长为90分钟，即输入 90 即可"
        />
        <ProFormRadio.Group
            width="xl"
            name="type"
            label="组卷模式"
            tooltip="快速组卷将会出10题，填空题4题编码题6题，难度按照3：5：2分布；"
            options={[
                {
                    label: '快速组卷',
                    value: '快速组卷',
                },
                {
                    label: '范围组卷',
                    value: '范围组卷',
                },
                {
                    label: '自定义组卷',
                    value: '自定义组卷',
                }
            ]}
            rules={[{ required: true, message: '请选择组卷模式！' }]}
        />
        { 
            testType === '范围组卷' && (
                <>
                    <BetaSchemaForm<DataItem>
                        layoutType="Embed"
                        columns={[{ 
                            valueType: 'formList',
                            dataIndex: 'tns',
                            columns:[{
                                valueType: 'group',
                                columns:[
                                    {
                                        title: '标签',
                                        dataIndex: 'tag',
                                        valueType: 'select',
                                        width: 'sm',
                                        valueEnum: tagEnum,
                                        formItemProps: {
                                            rules: [
                                                {
                                                required: true,
                                                message: '此项为必填项',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        title: '难度',
                                        width: 'xs',
                                        dataIndex: 'diff',
                                        valueType: 'select',
                                        formItemProps: {
                                            rules: [
                                                {
                                                required: true,
                                                message: '此项为必填项',
                                                },
                                            ],
                                        },
                                        valueEnum: diffEnum,
                                    },
                                    {
                                        title: '类型',
                                        dataIndex: 'type',
                                        valueType: 'select',
                                        width: 'xs',
                                        valueEnum: typeEnum,
                                        formItemProps: {
                                            rules: [
                                                {
                                                required: true,
                                                message: '此项为必填项',
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        title: '数目',
                                        width: 'xs',
                                        dataIndex: 'nums',
                                        formItemProps: {
                                            rules: [
                                                {
                                                required: true,
                                                message: '此项为必填项',
                                                },
                                            ],
                                        },
                                    },
                                ]
                            }]
                        }]}
                    />
                </>
            )
        }
        { 
            testType === '自定义组卷' && (
                <>
                    <BetaSchemaForm<DataItem>
                        layoutType="Embed"
                        columns={[{ 
                            valueType: 'formList',
                            dataIndex: 'tns',
                            columns:[{
                                valueType: 'group',
                                columns:[
                                    {
                                        title: '题目ID',
                                        width: 'md',
                                        dataIndex: 'tqID',
                                        formItemProps: {
                                            rules: [
                                                {
                                                required: true,
                                                message: '此项为必填项',
                                                },
                                            ],
                                        },
                                    },
                                ]
                            }]
                        }]}
                    />
                </>
            )
        }
      </ProForm>
    </div>
  );
};