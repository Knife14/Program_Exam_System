import React, { useState } from 'react';
import { message, Tabs, Space, Modal } from 'antd';
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
  } from '@ant-design/pro-form';
import { stuAddPro } from '../../../services/swagger/exam';

type ProType = '填空题' | '编码题';

export default () => {
    const [proType, setProType] = useState<ProType>('填空题');
    var [proData, setData] = useState({});
    var [isModalVisible, setIsModalVisible] = useState(false);

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

    // 处理对话框
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);

        // 接口调用
        let msg = await stuAddPro(proData);
        if (msg.status === 'ok') {
            alert('添加成功！');
        } else {
            alert('添加失败！');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
        <ProForm
            name="addPro_from"
            onFinish={async (value) => {
                // test
                // let send_data = value;
                // send_data['type'] = proType; 
                // console.log(value);

                setIsModalVisible(true);
                setData(value);
            }}
        >
            <ProFormGroup label="新建试题">
            </ProFormGroup>
            <ProFormText 
                width="xl" 
                name="name" 
                label="名称" 
                rules={[{ required: true, message: '请输入题目名称！' }]}
            />
            <ProFormSelect
                mode="tags" 
                width="xl" 
                name="limits" 
                label="限制条件" 
                tooltip="时间限制以ms为单位，内存限制以mb为单位。每个标签以回车（enter）键为结束"
            />
            <ProFormSelect
                width="xl"
                mode="tags"
                name="tags"
                label="标签"
                valueEnum={tags_dict}
            />
            <ProFormSelect
                width="xl"
                mode="single"
                name="difficulty"
                label="难度"
                valueEnum={{
                '简单': '简单',
                '困难': '困难',
                '中等': '中等',
                }}
                rules={[{ required: true, message: '请输入题目内容！' }]}
            />
            <ProFormTextArea
                width="xl"
                name="content"
                label="内容"
                rules={[{ required: true, message: '请输入题目内容！' }]}
                tooltip="输入框右下角可以自由拉伸。"
            />
            <ProFormList
                name="examples"
                label="示例"
                tooltip="多个输入 / 输出参数请以 ,(英文符号逗号) 间隔"
                rules={[
                {
                    validator: async (_, value) => {
                    // console.log(value);
                    if (value && value.length > 0) {
                        return;
                    }
                    throw new Error('至少要有一项！');
                    },
                },
                ]}
                creatorButtonProps={{
                position: 'bottom',
                }}
            >
                <ProFormGroup>
                <ProFormTextArea
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                    name="input"
                    width='md'
                    label="输入"
                />
                <ProFormTextArea
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                    name="output"
                    width='md'
                    label="输出"
                />
                </ProFormGroup>
            </ProFormList>
            <ProFormList
                name="cases"
                label="测试用例"
                tooltip="多个输入 / 输出参数请以 ,(英文符号逗号) 间隔"
                rules={[
                {
                    validator: async (_, value) => {
                    // console.log(value);
                    if (value && value.length > 0) {
                        return;
                    }
                    throw new Error('至少要有一项！');
                    },
                },
                ]}
                creatorButtonProps={{
                position: 'bottom',
                }}
            >
                <ProFormGroup>
                <ProFormTextArea
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                    name="input"
                    width='md'
                    label="输入"
                />
                <ProFormTextArea
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                    name="output"
                    width='md'
                    label="输出"
                />
                </ProFormGroup>
            </ProFormList>
            <br />
        </ProForm>
        <Modal title="是否要上传？" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>请仔细确认你的提交内容，并且谨慎决定上传！一经上传，学生端将无任何手段取消或删除记录！</p>
        </Modal>
        </div>
    );
};