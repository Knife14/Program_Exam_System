// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/examonline/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{data: API.CurrentUser;}>('/examonline/currentUser', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/examonline/outLogin', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'POST',
    ...(options || {}),
  });
}

/** 修改个人信息 POST /examonline/changeMyself */
export async function changeMyself(body: { [key: string]: any}, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/changeMyself', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取所有用户 GET /examonline/getUsers */
export async function getUsers(options?: { [key: string]: any }) {
  return request<any>('/examonline/getUsers', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    method: 'GET',
    ...(options || {}),
  });
}

/** 添加用户 PUT /examonline/addUser */
export async function addUser(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/addUser', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    data: body,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 获取该名用户信息 POST /examonline/gettheUser */
export async function gettheUser(body: any, options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/examonline/gettheUser', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    data: body,
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取该名用户信息 POST /examonline/changeUser */
export async function changeUser(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/changeUser', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    data: body,
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取该名用户信息 POST /examonline/deleteUser */
export async function deleteUser(body: any, options?: { [key: string]: any }) {
  return request<API.NothingResponse>('/examonline/deleteUser', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization':`Bearer ${localStorage.getItem('token')}`
    },
    data: body,
    method: 'POST',
    ...(options || {}),
  });
}