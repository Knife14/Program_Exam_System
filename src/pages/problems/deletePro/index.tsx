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
import { getthePro, deletePro } from '../../../services/swagger/exam';

type ProType = '填空题' | '编码题';

export default () => {
    let [proData, SetData] = useState({});
    const location = useLocation();
    const proID = location.query['proid'].toString();

    let examples = [];
    let proType: string;

    const saved_tags = [
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

    useEffect(async () => {
        var msg = await getthePro(proID);

        // 处理限制条件
        // 去除空格
        const reg = /\s+/g;
        var limit = msg['data']['limit'].replace(reg,'');

        // string -> list 中文字符串无法使用json进行快速转换
        limit = limit.slice(1, limit.length - 1).split(",");

        msg['data']['limit'] = limit;

        if (msg['data']['type'] === '填空题') {
            msg['data']['examples'] = null;
            msg['data']['cases'] = null;
        }

        // 传递数据
        SetData(msg['data']);
    }, []);

    return (
        <div style={{ whiteSpace: 'pre-wrap'}}>
            <ProForm
                name="changePro_from"
                submitter={{
                    // 配置按钮文本
                    searchConfig: {
                      submitText: '确认',
                    },
                    // 配置按钮的属性
                    resetButtonProps: {
                        style: {
                        // 隐藏重置按钮
                        display: 'none',
                        },
                    },
                }}
                onFinish={async (values) => {
                    values['proID'] = proID;
                    let msg = await deletePro(values);
                    if (msg.status === 'ok') {
                        alert('删除成功！');
                    } else {
                        alert('删除失败！');
                    }
                  }}
            >
                <ProFormGroup label="删除试题">
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
                    tooltip="时间限制以ms为单位，内存限制以kb为单位。每个标签以回车（enter）键为结束"
                    value={proData['limit']}
                    allowClear={false}
                />
                <ProFormCheckbox.Group
                    width={700}
                    name="tags"
                    layout="horizontal"
                    label="标签"
                    options={saved_tags}
                    value={proData['tags']}
                />
                <ProFormTextArea
                    readonly
                    width="xl"
                    name="content"
                    label="内容"
                    tooltip="输入框右下角可以自由拉伸；若是代码段，考生所需填代码以 ___; 表示（3条下划线）"
                    value={proData['content']}
                />
                <ProFormTextArea
                  readonly
                  width="xl" 
                  name="inputnum" 
                  label="所需填入代码段数"
                  value={proData['inputnum']} 
                />
                <ProFormTextArea
                    readonly
                    width="xl"
                    name="answers"
                    label="答案"
                    value={proData['answers']}
                />
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
                <br />
            </ProForm>
        </div>
    );
};