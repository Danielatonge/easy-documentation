import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/admin';

export const getBookListApiMethod = async () => {
  const books = await sendRequest(`${BASE_PATH}/books`, { method: 'GET' });
  return books;
};
