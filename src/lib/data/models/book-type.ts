import { Model, model, models, Schema } from 'mongoose';
import { BookTypeEntity } from '@/lib/data/types';

const bookTypeSchema = new Schema<BookTypeEntity, Model<BookTypeEntity>>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imageId: String
});

export default models.bookType || model('bookType', bookTypeSchema);
