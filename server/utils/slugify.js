const _ = require('lodash');

const slugify = (text) => _.kebabCase(text);

const createUniqueSlug = async (Model, slug, count) => {
  const uniqueSlug = `${slug}-${count}`;
  const object = await Model.findOne({ slug: uniqueSlug }, 'id');

  if (!object) {
    return uniqueSlug;
  }

  return createUniqueSlug(Model, slug, count + 1);
};

const generateSlug = async (Model, textToSlug, filter = {}) => {
  const origSlug = slugify(textToSlug);
  const object = await Model.findOne({ slug: origSlug, ...filter }, 'id');

  if (!object) {
    return origSlug;
  }

  return createUniqueSlug(Model, origSlug, 1);
};

module.exports = generateSlug;
