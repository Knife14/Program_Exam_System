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

/** 考试程序测试 POST /examonline/testProgram */
export async function testProgram(body: { [key: string]: any}, options?: { [key: string]: any }) {
  return request<API.TestProgram>('/examonline/testProgram', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}