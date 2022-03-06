import { request } from 'umi';

/** 获取所有试题 GET /examonline/getProblems */
export async function getProblems(options?: { [key: string]: any }) {
  return request<any>('/examonline/getProblems', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'GET',
    ...(options || {}),
  });
}

/** 添加试题 PUT /examonline/addProblem */
export async function addProblem(body: { [key: string]: any}, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/addProblem', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 获取对应试题 POST /examonline/getthePro */
export async function getthePro(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/getthePro', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 修改对应试题 POST /examonline/changePro */
export async function changePro(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/changePro', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除对应试题 POST /examonline/deletePro */
export async function deletePro(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/deletePro', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取所有考试 GET /examonline/getExams */
export async function getExams(options?: { [key: string]: any }) {
  return request<any>('/examonline/getExams', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'GET',
    ...(options || {}),
  });
}

/** 添加考试 PUT /examonline/addExam */
export async function addExam(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/addExam', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 获取当前考试具体内容 POST /examonline/gettheExam */
export async function gettheExam(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/gettheExam', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


/** 修改考试个别题目 POST /examonline/changeExam */
export async function changeExam(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/changeExam', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 修改考试个别题目 POST /examonline/deleteExam */
export async function deleteExam(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/deleteExam', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 学生端获取考试内容 POST /examonline/stuGetExam */
export async function stuGetExam(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/stuGetExam', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 考试编码题测试 POST /examonline/testProgram */
export async function testProgram(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/testProgram', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


/** 考试填空题提交 POST /examonline/testFill */
export async function testFill(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/testFill', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 考试情况（成绩、异常）统计回馈 POST /examonline/getScore */
export async function getScore(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/getScore', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 结束并退出考试 POST /examonline/exitExam */
export async function exitExam(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/exitExam', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 学生端发送异常状态 POST /examonline/sendAbnormal */
export async function sendAbnormal(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/sendAbnormal', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 监考 POST /examonline/Invigilation */
export async function Invigilation(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/Invigilation', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 监考之提交记录 POST /examonline/getSubmits */
export async function getSubmits(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/getSubmits', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 监考之异常记录 POST /examonline/getAbnormals */
export async function getAbnormals(body: any, options?: { [key: string]: any }) {
  return request<any>('/examonline/getAbnormals', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 反馈所有考试记录 POST /examonline/getRecords */
export async function getRecords(options?: { [key: string]: any }) {
  return request<any>('/examonline/getRecords', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'GET',
    ...(options || {}),
  });
}

/** 反馈个人考试记录 POST /examonline/getRecord */
export async function getRecord(body: any,options?: { [key: string]: any }) {
  return request<any>('/examonline/getRecord', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除个人考试记录 POST /examonline/deleteRecord */
export async function deleteRecord(body: any,options?: { [key: string]: any }) {
  return request<any>('/examonline/deleteRecord', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取自己创建的所有试题 GET /examonline/stuGetPros */
export async function stuGetPros(options?: { [key: string]: any }) {
  return request<any>('/examonline/stuGetPros', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'GET',
    ...(options || {}),
  });
}

/** 添加试题 PUT /examonline/stuAddPro */
export async function stuAddPro(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/stuAddPro', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 获取学生创建的所有试题 GET /examonline/getAudits */
export async function getAudits(options?: { [key: string]: any }) {
  return request<any>('/examonline/getAudits', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'GET',
    ...(options || {}),
  });
}

/** 提交题目审核结果 POST /examonline/changeAudit */
export async function changeAudit(body: any,options?: { [key: string]: any }) {
  return request<any>('/examonline/changeAudit', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}