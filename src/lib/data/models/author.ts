import { Model, model, models, Schema } from 'mongoose';
import { AuthorEntity } from '@/lib/data/types';

const authorSchema = new Schema<AuthorEntity, Model<AuthorEntity>>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String
});

export default models.author || model('author', authorSchema);
