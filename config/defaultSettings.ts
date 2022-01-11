import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  title: '程序设计类在线考试系统',
  navTheme: "light",
  primaryColor: "#13C2C2",
  layout: "mix",
  contentWidth: "Fixed",
  fixedHeader: true,
  fixSiderbar: true,
  pwa: false,
  logo: "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
  headerHeight: 48,
  splitMenus: false,
};

export default Settings;
