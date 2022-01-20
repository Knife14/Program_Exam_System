import { request } from 'umi';

/** Create user This can only be done by the logged in user. POST /user */
export async function testProgram(body: { [key: string]: any}, options?: { [key: string]: any }) {
  return request<API.TestProgram>('/examonline/testProgram', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
