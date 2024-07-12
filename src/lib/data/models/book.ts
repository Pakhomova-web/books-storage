import { Model, model, models, Schema } from 'mongoose';
import {
    AuthorEntity,
    BookEntity,
    BookSeriesEntity,
    BookTypeEntity,
    CoverTypeEntity, LanguageEntity,
    PageTypeEntity
} from '@/lib/data/types';

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
    bookSeriesId: {
        ref: 'bookSeries',
        type: Schema.Types.ObjectId,
        required: true
    },
    coverTypeId: {
        ref: 'coverType',
        type: Schema.Types.ObjectId,
        required: true
    },
    bookTypeId: {
        ref: 'bookType',
        type: Schema.Types.ObjectId,
        required: true
    },
    pageTypeId: {
        ref: 'pageType',
        type: Schema.Types.ObjectId,
        required: true
    },
    languageId: {
        ref: 'language',
        type: Schema.Types.ObjectId,
        required: true
    },
    authorId: {
        ref: 'author',
        type: Schema.Types.ObjectId
    }
});

export default models.book || model('book', bookSchema);
