/* eslint-disable no-use-before-define */

const mongoose = require('mongoose');
// const Book = require('./Book');

const { Schema, model } = mongoose;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

const mongoSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isFree: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    default: '',
  },
  htmlContent: {
    type: String,
    required: true,
    default: '',
  },
  excerpt: {
    type: String,
    default: '',
  },
  htmlExcerpt: {
    type: String,
    default: '',
  },
  githubFilePath: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  seoTitle: String,
  seoDescription: String,
  sections: [
    {
      text: String,
      level: Number,
      escapedText: String,
    },
  ],
});

class ChapterClass {
  static async getBySlug({ bookSlug, chapterSlug }) {
    const book = await Book.getBySlug({ slug: bookSlug });
    if (!book) throw new Error(`Book with slug ${bookSlug} not found`);

    const chapterDoc = await this.findOne({ bookId: book._id, slug: chapterSlug });
    if (!chapterDoc)
      throw new Error(
        `Chapter with slug ${chapterSlug} belonging to book with slug ${bookSlug} not found`,
      );
    const chapter = chapterDoc.toObject();

    chapter.book = book;

    return chapter;
  }
}

mongoSchema.index({ bookId: 1, slug: 1 }, { unique: true });
mongoSchema.index({ bookId: 1, githubFilePath: 1 }, { unique: true });

mongoSchema.loadClass(ChapterClass);

const Chapter = model('Chapter', mongoSchema);

module.exports = Chapter;

const Book = require('./Book');
