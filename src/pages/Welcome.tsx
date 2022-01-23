import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome: React.FC = () => {
  const intl = useIntl();

  return (
    <PageContainer style={{color:'gray', textAlign: 'center', fontSize: 40}}>
      <br />
      <br />
      欢迎使用本在线考试系统！
      <br />
      希望您有一个顺利的使用过程！
    </PageContainer>
  );
};

export default Welcome;
