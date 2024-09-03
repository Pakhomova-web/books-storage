import { Model, model, models, Schema } from 'mongoose';
import { OrderEntity } from '@/lib/data/types';

const orderSchema = new Schema<OrderEntity, Model<OrderEntity>>({
    customerFirstName: {
        type: String,
        required: true,
    },
    customerLastName: {
        type: String,
        required: true
    },
    customerPhoneNumber: {
        type: String,
        required: true
    },
    deliveryCompany: {
        ref: 'delivery',
        type: Schema.Types.ObjectId
    },
    isPaid: Boolean,
    isPartlyPaid: Boolean,
    isDelivered: Boolean,
    isDone: Boolean,
    trackingNumber: String,
    description: String,
    address: {
        region: {
            type: String,
            required: true
        },
        district: String,
        city: {
            type: String,
            required: true
        },
        postcode: {
            type: String,
            required: true
        }
    },
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
    ]
});

export default models.order || model('order', orderSchema);
