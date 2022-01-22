import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Layout } from 'antd';
import { currentUser, changeMyself } from '@/services/ant-design-pro/api';

const { Header, Content, Footer } = Layout;

const Index: React.FC = () => {
    let [current_user, setCurrentUser] = useState({});
    let [phone, setPhone] = useState('');
    let [email, setEmail] = useState('');

    useEffect(async () => {
      let res_data = await currentUser();
      setCurrentUser(res_data['data']);
    }, []);

    const change_phone = (event) => {
        setPhone(event.target.value);
    };

    const change_email = (event) => {
        setEmail(event.target.value);
    };

    const change_msg = async () => {
        let data = {
            "phone": phone,
            "email": email,
        };

        let res = await changeMyself(data);
        if (res.status === 'ok'){
            alert('修改成功！');
        } else {
            alert('修改失败！');
        }
    };

    return (
        <>
        <Layout>
            <Header style = {{ color: 'white', textAlign: 'center'} }>个人信息</Header>
            <Content style = {{textAlign: 'match-parent'}}>
                <br />
                <b>姓名： {current_user['name']}</b>
                <br /><br />
                <b>学号： {current_user['userid']}</b>
                <br /><br />
                <b>学院： {current_user['college']}</b>
                <br /><br />
                <b>手机号： </b>
                <Input 
                    style={{ width: 300}} 
                    placeholder={current_user['phone']}
                    maxLength='11'
                    allowClear='true'
                    onChange={(event) => change_phone(event)}
                />
                <br /><br />
                <b>邮箱：   </b>
                <Input 
                    style={{ width: 300}} 
                    placeholder={current_user['email']}
                    allowClear='true'
                    onChange={(event) => change_email(event)}
                />
                <br />
            </Content>
            <Footer style={{ textAlign: 'center'}}>
                <Button type='primary' onClick={change_msg}>提交</Button>
            </Footer>
        </Layout>
        </>
    );
};

export default Index;