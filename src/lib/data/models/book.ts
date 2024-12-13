import { Model, model, models, Schema } from 'mongoose';
import { BookEntity } from '@/lib/data/types';

const bookSchema = new Schema<BookEntity, Model<BookEntity>>({
    name: {
        type: String,
        required: true
    },
    description: String,
    isbn: String,
    format: String,
    numberOfPages: Number,
    numberInStock: Number,
    numberSold: Number,
    price: Number,
    imageIds: [String],
    bookSeries: {
        ref: 'bookSeries',
        type: Schema.Types.ObjectId,
        required: true
    },
    coverType: {
        ref: 'coverType',
        type: Schema.Types.ObjectId,
        required: true
    },
    bookTypes: [{
        ref: 'bookType',
        type: Schema.Types.ObjectId,
        required: true
    }],
    pageType: {
        ref: 'pageType',
        type: Schema.Types.ObjectId,
        required: true
    },
    languages: [{
        ref: 'language',
        type: Schema.Types.ObjectId,
        required: true
    }],
    authors: [{
        ref: 'author',
        type: Schema.Types.ObjectId
    }],
    illustrators: [{
        ref: 'author',
        type: Schema.Types.ObjectId
    }],
    tags: [String],
    archived: Boolean,
    ages: [Number],
    discount: Number,
    comments: [{
        email: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        approved: Boolean,
        date: {
            type: String,
            required: true
        }
    }],
    languageBooks: [{
        type: Schema.Types.ObjectId,
        ref: 'book'
    }]
});

bookSchema.index({ name: 1, bookSeries: 1, bookTypes: 1, pageType: 1, coverType: 1, language: 1 }, { unique: true });

export default models?.book || model('book', bookSchema);
