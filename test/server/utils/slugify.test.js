const generateSlug = require('../../../server/utils/slugify');

const MockUser = {
  slugs: ['john-frank', 'john-frank-1', 'john-rim'],
  findOne({ slug }) {
    if (this.slugs.includes(slug)) {
      return Promise.resolve({ id: 'id' });
    }
    return Promise.resolve(null);
  },
};

describe('slugify', () => {
  test('no duplication', () => {
    expect.assertions(1);
    return generateSlug(MockUser, 'John Doe').then((slug) => {
      expect(slug).toBe('john-doe');
    });
  });

  test('one duplication', () => {
    expect.assertions(1);
    return generateSlug(MockUser, 'John Rim').then((slug) => {
      expect(slug).toBe('john-rim-1');
    });
  });

  test('multiple duplications', () => {
    expect.assertions(1);
    return generateSlug(MockUser, 'John Frank').then((slug) => {
      expect(slug).toBe('john-frank-2');
    });
  });
});
