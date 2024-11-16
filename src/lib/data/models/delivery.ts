import { Model, model, models, Schema } from 'mongoose';
import { DeliveryEntity } from '@/lib/data/types';

const deliverySchema = new Schema<DeliveryEntity, Model<DeliveryEntity>>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imageId: String
});

export default models.delivery || model('delivery', deliverySchema);
