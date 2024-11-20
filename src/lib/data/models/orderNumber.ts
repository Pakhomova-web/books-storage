import { Model, model, models, Schema } from 'mongoose';
import { OrderEntity, OrderNumberEntity } from '@/lib/data/types';

const orderNumberSchema = new Schema<OrderNumberEntity, Model<OrderNumberEntity>>({
    value: {
        type: Number,
        required: true
    }
});

export default models.orderNumber || model('orderNumber', orderNumberSchema);
