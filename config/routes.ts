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
    name: 'StuCenter',
    icon: 'bars',
    path: '/student/center',
    access: 'canStudent',
    component: './student/center',
  },
  {
    name: 'TeaCenter',
    icon: 'bars',
    path: '/teacher/center',
    access: 'canTeacher',
    component: './teacher/center',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  // {
  //   name: 'demo',
  //   path: '/demo',
  //   icon: 'star',
  //   component: './demo/',
  // },
  {
    name: 'UserList',
    path: '/admin/UserList',
    icon: 'unorderedList',
    access: 'canAdmin',
    component: './admin/userList',
  },
  {
    path: '/admin/AddUser',
    access: 'canAdmin',
    component: './admin/addUser',
  },
  {
    path: '/admin/ChangeInfo',
    access: 'canAdmin',
    component: './admin/changeInfo',
  },
  {
    path: '/admin/DeleteUser',
    access: 'canAdmin',
    component: './admin/deleteUser',
  },
  {
    name: 'ProList',
    path: '/ProList',
    icon: 'plus',
    access: 'canTeacher' + 'canAdmin',
    component: './problems/problemsList',
  },
  {
    path: '/addProblem',
    access: 'canTeacher' + 'canAdmin',
    component: './problems/addProblem',
  },
  {
    path: '/changePro',
    access: 'canTeacher' + 'canAdmin',
    component: './problems/changePro',
  },
  {
    path: '/deletePro',
    access: 'canTeacher' + 'canAdmin',
    component: './problems/deletePro',
  },
  {
    name: 'ExamList',
    path: '/ExamList',
    icon: 'code',
    access: 'canTeacher' + 'canAdmin',
    component: './teacher/TeaExamList',
  },
  {
    name: 'StuExamList',
    path: '/student/ExamList',
    icon: 'code',
    access: 'canStudent',
    component: './student/StuExamList',
  },
  {
    path: '/student/exam',
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
