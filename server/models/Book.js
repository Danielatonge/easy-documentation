/* eslint-disable no-use-before-define */

const mongoose = require('mongoose');
const generateSlug = require('../utils/slugify');
// const Chapter = require('./Chapter');

const { Schema, model } = mongoose;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  githubRepo: {
    type: String,
    required: true,
  },
  githubLastCommitSha: String,
  createdAt: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

class BookClass {
  static async list({ offset = 0, limit = 10 } = {}) {
    const books = await this.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit);
    return { books };
  }

  static async getBySlug({ slug }) {
    const bookDoc = await this.findOne({ slug });

    if (!bookDoc) throw new Error(`Book with slug: ${slug} not found`);

    const book = bookDoc.toObject();

    const chapters = await Chapter.find({ bookId: book._id }, 'title slug').sort({ order: 1 });

    book.chapters = chapters.map((chapter) => chapter.toObject());

    return book;
  }

  static async add({ name, price, githubRepo }) {
    const slug = await generateSlug(this, name);

    if (!slug) throw new Error(`Error with slug generation for name: ${name}`);

    const book = await this.create({ name, price, githubRepo, slug, createdAt: new Date() });

    return book;
  }

  static async edit({ id, name, price, githubRepo }) {
    const book = await this.findById(id, 'slug name');

    if (!book) throw new Error(`Book with id: ${id} not found`);

    const modifier = { price, githubRepo };
    if (name !== book.name) {
      modifier.name = name;
      modifier.slug = await generateSlug(this, name);
    }

    const updatedBook = await this.updateOne(
      { _id: id },
      {
        $set: modifier,
      },
    );

    return updatedBook;
  }

  static syncContent() {}

  static buy() {}
}

mongoSchema.loadClass(BookClass);

const Book = model('Book', mongoSchema);

module.exports = Book;

const Chapter = require('./Chapter');
