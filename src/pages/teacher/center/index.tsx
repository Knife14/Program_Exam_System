import React from 'react';
import { Input, Button, Layout } from 'antd';

const { Header, Content, Footer } = Layout;

var Name = "测试教师";
var T_ID = "2003123666";  // 2003 - 123 - 666: 任职年份 - 学院编号 - 个人id
var college = "计算机学院";
var email = "value_1218@163.com";
var telephone = "15986160993";

const Index: React.FC = () => {
    return (
        <>
        <Layout>
            <Header style = {{ color: 'white', textAlign: 'center'} }>个人信息</Header>
            <Content style = {{textAlign: 'match-parent'}}>
                <br />
                <b>姓名： {Name}</b>
                <br /><br />
                <b>学号： {T_ID}</b>
                <br /><br />
                <b>学院： {college}</b>
                <br /><br />
                <b>手机号： </b><Input style={{ width: 300}} defaultValue={telephone}/>
                <br /><br />
                <b>邮箱：   </b><Input style={{ width: 300}} defaultValue={email}/>
                <br />
            </Content>
            <Footer style={{ textAlign: 'center'}}>
                <Button type='primary'>提交</Button>
            </Footer>
        </Layout>
        </>
    );
};

export default Index;