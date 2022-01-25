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

/** 添加试题 POST /examonline/addProblem */
export async function addProblem(body: { [key: string]: any}, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/addProblem', {
    method: 'POST',
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