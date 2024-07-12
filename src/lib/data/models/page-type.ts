import { Model, model, models, Schema } from 'mongoose';
import { PageTypeEntity } from '@/lib/data/types';

const pageTypeSchema = new Schema<PageTypeEntity, Model<PageTypeEntity>>({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

export default models.pageType || model('pageType', pageTypeSchema);
