import { Model, model, models, Schema } from 'mongoose';
import { OrderEntity } from '@/lib/data/types';

const orderSchema = new Schema<OrderEntity, Model<OrderEntity>>({
    user: {
        ref: 'user',
        type: Schema.Types.ObjectId,
        required: true
    },
    orderNumber: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    delivery: {
        ref: 'delivery',
        type: Schema.Types.ObjectId
    },
    isPaid: Boolean,
    isPartlyPaid: Boolean,
    isConfirmed: Boolean,
    isCanceled: Boolean,
    isSent: Boolean,
    isDone: Boolean,
    trackingNumber: String,
    comment: String,
    region: {
        type: String,
        required: true
    },
    district: String,
    city: {
        type: String,
        required: true
    },
    postcode: Number,
    novaPostOffice: Number,
    books: [
        {
            book: {
                ref: 'book',
                type: Schema.Types.ObjectId
            },
            count: {
                type: Number,
                required: true
            },
            discount: Number,
            price: {
                type: Number,
                required: true
            }
        }
    ],
    date: String
});

export default models.order || model('order', orderSchema);
