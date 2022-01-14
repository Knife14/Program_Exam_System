import React from 'react';
import { Input, Button, Layout } from 'antd';

const { Header, Content, Footer } = Layout;

var Name = "测试学生";
var S_ID = "20184281";
var college = "计算机学院";
var major = "物联网工程";
var email = "";
var telephone = "";

const Index: React.FC = () => {
    return (
        <>
        <Layout>
            <Header style = {{ color: 'white', textAlign: 'center'} }>个人信息</Header>
            <Content style = {{textAlign: 'match-parent'}}>
                <br />
                <b>姓名： {Name}</b>
                <br /><br />
                <b>学号： {S_ID}</b>
                <br /><br />
                <b>学院： {college}</b>
                <br /><br />
                <b>专业： {major}</b>
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