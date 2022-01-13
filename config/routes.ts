export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: 'demo',
    path: '/demo',
    icon: 'star',
    component: './demo/',
  },
  {
    name: 'teacher',
    path: '/teacher',
    icon: 'edit',
    access: 'canTeacher',
  },
  {
    name: 'TeaExamList',
    path: '/TeaExamList',
    icon: 'code',
    access: 'canTeacher',
    component: './teacher/TeaExamList',
  },
  {
    name: 'StuExamList',
    path: '/StuExamList',
    icon: 'code',
    access: 'canStudent',
    component: './student/StuExamList',
  },
  {
    path: '/exam',
    layout: false,
    access: 'canStudent',
    component: './student/exam',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
