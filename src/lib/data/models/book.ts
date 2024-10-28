import { Model, model, models, Schema } from 'mongoose';
import { BookEntity } from '@/lib/data/types';

const bookSchema = new Schema<BookEntity, Model<BookEntity>>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    isbn: String,
    format: String,
    numberOfPages: Number,
    numberInStock: Number,
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
    bookType: {
        ref: 'bookType',
        type: Schema.Types.ObjectId,
        required: true
    },
    pageType: {
        ref: 'pageType',
        type: Schema.Types.ObjectId,
        required: true
    },
    language: {
        ref: 'language',
        type: Schema.Types.ObjectId,
        required: true
    },
    authors: [{
        ref: 'author',
        type: Schema.Types.ObjectId
    }],
    tags: [String],
    archived: Boolean,
    ages: [Number],
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
    }]
});

bookSchema.index({ name: 1, bookSeries: 1, bookType: 1 }, { unique: true });

export default models?.book || model('book', bookSchema);
