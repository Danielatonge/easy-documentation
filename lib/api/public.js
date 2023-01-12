import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/public';

export const getChapterDetailApiMethod = async ({ bookSlug, chapterSlug }, options = {}) => {
  const chapterDetail = await sendRequest(
    `${BASE_PATH}/get-chapter-detail?bookSlug=${bookSlug}&chapterSlug=${chapterSlug}`,
    { method: 'GET', ...options },
  );
  return chapterDetail;
};
