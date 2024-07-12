import { Model, model, models, Schema } from 'mongoose';
import { CoverTypeEntity } from '@/lib/data/types';

const coverTypeSchema = new Schema<CoverTypeEntity, Model<CoverTypeEntity>>({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

export default models.coverType || model('coverType', coverTypeSchema);
