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
import { getthePro, changePro } from '../../../services/swagger/exam';

type ProType = '填空题' | '编码题';

export default () => {
    let [proData, SetData] = useState({});
    let [lcontent, SetContent] = useState([]);
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
        console.log(limit);

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
                <ProFormGroup label="编辑试题" tooltip="如需修改题目类型，请删除原题，再新建试题">
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
                    tooltip="请不要在这里修改！"
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
                    tooltip="请不要在这里修改！"
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
            <DrawerForm
                title="编辑试题"
                trigger={
                    <Button type="primary">
                    修改
                    </Button>
                }
                autoFocusFirstInput
                drawerProps={{
                    forceRender: true,
                    destroyOnClose: true,
                }}
                onFinish={async (values) => {
                    // console.log(values);

                    values['proID'] = proID;
                    values['proType'] = proData['type'];
                    let msg = await changePro(values);
                    if (msg.status === 'ok') {
                        alert('修改成功！');
                    } else {
                        alert('修改失败！');
                    }
                }}
                >
                {
                    proData['type'] === '填空题' && (
                        <>
                          <ProFormText 
                              width="xl" 
                              name="name" 
                              label="名称" 
                              // rules={[{ required: true, message: '请输入题目名称！' }]}
                          />
                          <ProFormCheckbox.Group
                            width={700}
                            name="tags"
                            layout="horizontal"
                            label="标签"
                            options={saved_tags}
                          />
                          <ProFormTextArea
                              width="xl"
                              name="content"
                              label="内容"
                              // rules={[{ required: true, message: '请输入题目内容！' }]}
                              tooltip="输入框右下角可以自由拉伸；若是代码段，考生所需填代码以 ___; 表示（3条下划线）"
                          />
                          <ProFormText 
                            width="xl" 
                            name="inputnum" 
                            label="所需填入代码段数" 
                          />
                          <ProFormText
                            name="answers"
                            width="xl"
                            label="答案"
                            tooltip="如有多个答案，请以代码将会输出的格式进行严格填写"
                          />
                          <br />
                        </>
                    )
                }
                {
                    proData['type'] === '编码题' && (
                        <>
                          <ProFormText 
                              width="xl" 
                              name="name" 
                              label="名称" 
                              // rules={[{ required: true, message: '请输入题目名称！' }]}
                          />
                          <ProFormSelect
                              mode="tags" 
                              width="xl" 
                              name="limits" 
                              label="限制条件" 
                              tooltip="时间限制以ms为单位，内存限制以kb为单位。每个标签以回车（enter）键为结束"
                          />
                          <ProFormCheckbox.Group
                            width={700}
                            name="tags"
                            layout="horizontal"
                            label="标签"
                            options={saved_tags}
                          />
                          <ProFormTextArea
                              width="xl"
                              name="content"
                              label="内容"
                              // rules={[{ required: true, message: '请输入题目内容！' }]}
                              tooltip="输入框右下角可以自由拉伸。"
                          />
                          <ProFormList
                            name="examples"
                            label="示例"
                            tooltip="如需修改，则需要修改所有示例；多个输入 / 输出参数请以 ,(英文符号逗号) 间隔"
                            /* rules={[
                              {
                                validator: async (_, value) => {
                                  // console.log(value);
                                  if (value && value.length > 0) {
                                    return;
                                  }
                                  throw new Error('至少要有一项！');
                                },
                              },
                            ]} */ 
                            creatorButtonProps={{
                              position: 'bottom',
                            }}
                          >
                            <ProFormGroup>
                              <ProFormTextArea
                                // rules={[
                                //   {
                                //     required: true,
                                //   },
                                // ]}
                                name="input"
                                width='md'
                                label="输入"
                              />
                              <ProFormTextArea
                                // rules={[
                                //   {
                                //     required: true,
                                //   },
                                // ]}
                                name="output"
                                width='md'
                                label="输出"
                              />
                            </ProFormGroup>
                          </ProFormList>
                          <ProFormList
                            name="cases"
                            label="测试用例"
                            tooltip="如需修改，则需要修改所有测试用例；多个输入 / 输出参数请以 ,(英文符号逗号) 间隔"
                            // rules={[
                            //   {
                            //     validator: async (_, value) => {
                            //       // console.log(value);
                            //       if (value && value.length > 0) {
                            //         return;
                            //       }
                            //       throw new Error('至少要有一项！');
                            //     },
                            //   },
                            // ]}
                            creatorButtonProps={{
                              position: 'bottom',
                            }}
                          >
                            <ProFormGroup>
                              <ProFormTextArea
                                // rules={[
                                //   {
                                //     required: true,
                                //   },
                                // ]}
                                name="input"
                                width='md'
                                label="输入"
                              />
                              <ProFormTextArea
                                // rules={[
                                //   {
                                //     required: true,
                                //   },
                                // ]}
                                name="output"
                                width='md'
                                label="输出"
                              />
                            </ProFormGroup>
                          </ProFormList>
                          <br />
                        </>
                    )
                }
            </DrawerForm>
        </div>
    );
};