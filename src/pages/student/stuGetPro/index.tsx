import React, { useState, useEffect } from 'react';
import { message, Tabs, Space, Descriptions, Button } from 'antd';
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
    ProFormTreeSelect,
    DrawerForm,
  } from '@ant-design/pro-form';
import { useLocation } from 'umi';
import { getthePro } from '../../../services/swagger/exam';

export default () => {
    let [proData, SetData] = useState({});
    let [lcontent, SetContent] = useState([]);
    const location = useLocation();
    const proID = location.query['tqid'].toString();

    let examples = [];
    let proType: string;

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
    let tags_dict = {};
  
    for (let tag of tags_list){
      tags_dict[tag] = tag;
    }

    useEffect(async () => {
        var msg = await getthePro(proID);

        // 处理限制条件
        // 去除空格
        const reg = /\s+/g;
        var tlimit = msg['data']['limit'].replace(reg,'');
        var limit = [];

        // string -> list 中文字符串无法使用json进行快速转换
        tlimit = tlimit.slice(1, tlimit.length - 1).split(",");
        for (let lim of tlimit){
          lim = lim.slice(1, lim.length - 1);
          limit.push(lim);
        }

        msg['data']['limit'] = limit;

        if (msg['data']['type'] === '填空题') {
            msg['data']['examples'] = null;
            msg['data']['cases'] = null;
        }

        // 处理长文本内容换行问题
        SetContent(msg['data']['content'].split(""));

        // 传递数据
        SetData(msg['data']);
    }, []);

    return (
        <div style={{ whiteSpace: 'pre-wrap'}}>
            <ProForm
                name="changePro_from"
                submitter={{
                    // 配置按钮的属性
                    resetButtonProps: {
                      style: {
                        // 隐藏重置按钮
                        display: 'none',
                      },
                    },
                    submitButtonProps: {},
                    // 完全自定义整个区域
                    render: (props, doms) => {
                      // console.log(props);
                      return [
        
                      ];
                    },
                  }}
            >
                <ProFormGroup label="编辑试题">
                </ProFormGroup>
                <ProFormTextArea
                    readonly
                    width="xl" 
                    name="name" 
                    label="名称"
                    value={proData['name']}
                    allowClear={false}
                />
                <ProFormSelect
                    mode="tags" 
                    width="xl" 
                    name="limits" 
                    label="限制条件" 
                    value={proData['limit']}
                    allowClear={false}
                />
                <ProFormTextArea
                    readonly
                    width="xl"
                    name="difficulty"
                    label="难度"
                    value={proData['difficulty']}
                />
                <ProFormCheckbox.Group
                    width={700}
                    name="tags"
                    layout="horizontal"
                    label="标签"
                    options={tags_list}
                    value={proData['tags']}
                />
                <ProFormTextArea
                    readonly
                    width="xl"
                    name="content"
                    label="内容"
                    value={proData['content']}
                />
            </ProForm>
            <label>示例</label>
            {
                proData['examples'] && proData['examples'].map((example) => {
                    return (
                        <div>
                            <Descriptions layout="vertical">
                                <Descriptions.Item label="输入">{example['input']}</Descriptions.Item>
                                <Descriptions.Item label="输出">{example['output']}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    )
                })
            }
            <br />
            <label>测试用例</label>
            {
                proData['cases'] && proData['cases'].map((tcase) => {
                    return (
                        <div>
                            <Descriptions layout="vertical">
                                <Descriptions.Item label="输入">{tcase['input']}</Descriptions.Item>
                                <Descriptions.Item label="输出">{tcase['output']}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    )
                })
            }
            <br />
        </div>
    );
};