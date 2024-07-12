import { Model, model, models, Schema } from 'mongoose';
import { LanguageEntity } from '@/lib/data/types';

const languageSchema = new Schema<LanguageEntity, Model<LanguageEntity>>({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

export default models.language || model('language', languageSchema);
