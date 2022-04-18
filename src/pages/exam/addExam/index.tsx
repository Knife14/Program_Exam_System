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
  var valueEnum = {};
  for (let tag of tags_list){
    valueEnum[tag] = {text: tag};
  }

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
            tooltip="每张试卷限出10题，将会以5道填空题5道编码题的形式进行组卷；"
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
                                        dataIndex: 'tags',
                                        valueType: 'select',
                                        width: 'md',
                                        valueEnum,
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