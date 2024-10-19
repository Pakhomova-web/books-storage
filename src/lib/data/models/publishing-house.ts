import { Model, model, models, Schema } from 'mongoose';
import { PublishingHouseEntity } from '@/lib/data/types';

const publishingHouseSchema = new Schema<PublishingHouseEntity, Model<PublishingHouseEntity>>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    tags: String
});

export default models?.publishingHouse || model('publishingHouse', publishingHouseSchema);
