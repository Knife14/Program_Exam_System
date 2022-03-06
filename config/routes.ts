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
  // admin
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
    path: '/admin/ProList',
    icon: 'plus',
    access: 'canAdmin',
    component: './problems/problemsList',
  },
  {
    path: '/admin/addProblem',
    access: 'canAdmin',
    component: './problems/addProblem',
  },
  {
    path: '/admin/changePro',
    access: 'canAdmin',
    component: './problems/changePro',
  },
  {
    path: '/admin/deletePro',
    access: 'canAdmin',
    component: './problems/deletePro',
  },
  {
    name: 'ExamList',
    path: '/admin/ExamList',
    icon: 'code',
    access: 'canAdmin',
    component: './exam/examList',
  },
  {
    path: '/admin/addExam',
    access: 'canAdmin',
    component: './exam/addExam',
  },
  {
    path: '/admin/changeExam',
    access: 'canAdmin',
    component: './exam/changeExam',
  },
  {
    path: '/admin/deleteExam',
    access: 'canAdmin',
    component: './exam/deleteExam',
  },
  {
    path: '/admin/showExam',
    access: 'canAdmin',
    component: './exam/showExam'
  },
  {
    path: '/admin/invigilation',
    access: 'canAdmin',
    component: './exam/invigilation'
  },
  {
    name: 'ExamRecords',
    icon: 'minus',
    path: '/admin/examRecords',
    access: 'canAdmin',
    component: './exam/examRecords'
  },
  {
    path: '/admin/examRecord',
    access: 'canAdmin',
    component: './exam/examRecord'
  },
  {
    name: 'AuditList',
    icon: 'diff',
    path: '/admin/auditList',
    access: 'canAdmin',
    component: './problems/auditList',
  },
  {
    path: '/admin/gettheAudit',
    access: 'canAdmin',
    component: './problems/gettheAudit'
  },
  // teacher
  {
    name: 'TeaCenter',
    icon: 'bars',
    path: '/teacher/center',
    access: 'canTeacher',
    component: './teacher/center',
  },
  {
    name: 'ProList',
    path: '/teacher/ProList',
    icon: 'plus',
    access: 'canTeacher',
    component: './problems/problemsList',
  },
  {
    path: '/teacher/addProblem',
    access: 'canTeacher',
    component: './problems/addProblem',
  },
  {
    path: '/teacher/changePro',
    access: 'canTeacher',
    component: './problems/changePro',
  },
  {
    path: '/teacher/deletePro',
    access: 'canTeacher',
    component: './problems/deletePro',
  },
  {
    name: 'ExamList',
    path: '/teacher/ExamList',
    icon: 'code',
    access: 'canTeacher',
    component: './exam/examList',
  },
  {
    path: '/teacher/addExam',
    access: 'canTeacher',
    component: './exam/addExam',
  },
  {
    path: '/teacher/changeExam',
    access: 'canTeacher',
    component: './exam/changeExam',
  },
  {
    path: '/teacher/deleteExam',
    access: 'canTeacher',
    component: './exam/deleteExam',
  },
  {
    path: '/teacher/showExam',
    access: 'canTeacher',
    component: './exam/showExam'
  },
  {
    path: '/teacher/invigilation',
    access: 'canTeacher',
    component: './exam/invigilation'
  },
  {
    name: 'ExamRecords',
    icon: 'minus',
    path: '/teacher/examRecords',
    access: 'canTeacher',
    component: './exam/examRecords'
  },
  {
    path: '/teacher/examRecord',
    access: 'canTeacher',
    component: './exam/examRecord'
  },
  {
    name: 'AuditList',
    icon: 'diff',
    path: '/teacher/auditList',
    access: 'canTeacher',
    component: './problems/auditList',
  },
  {
    path: '/admin/gettheAudit',
    access: 'canAdmin',
    component: './problems/gettheAudit'
  },
  // student
  {
    name: 'StuCenter',
    icon: 'bars',
    path: '/student/center',
    access: 'canStudent',
    component: './student/center',
  },
  {
    name: 'StuExamList',
    path: '/student/ExamList',
    icon: 'code',
    access: 'canStudent',
    component: './student/StuExamList',
  },
  {
    path: '/student/ExamContent',
    access: 'canStudent',
    component: './student/ExamContent',
    menuRender: false,
  },
  {
    name: 'StuSubmitList',
    path: '/student/SubmitList',
    icon: 'plus',
    access: 'canStudent',
    component: './student/SumbitList',
  },
  {
    path: '/student/stuAddPro',
    access: 'canStudent',
    component: './student/stuAddPro',
  },
  {
    path: '/student/stuGetPro',
    access: 'canStudent',
    component: './student/stuGetPro',
  },
  // all
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
