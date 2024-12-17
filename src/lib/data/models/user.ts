import { Model, model, models, Schema } from 'mongoose';
import { UserEntity } from '@/lib/data/types';

const userSchema = new Schema<UserEntity, Model<UserEntity>>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    role: {
        type: String,
        required: true
    },
    likedBookIds: [String],
    recentlyViewedBookIds: [String],
    basketItems: [{
        bookId: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    basketGroupDiscounts: [{
        groupDiscountId: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    novaPoshtaWarehouseAddress: {
        warehouse: {
            type: Number,
            required: true
        },
        region: {
            type: String,
            required: true
        },
        district: String,
        city: {
            type: String,
            required: true
        }
    },
    novaPoshtaCourierAddress: {
        region: {
            type: String,
            required: true
        },
        district: String,
        city: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        house: {
            type: String,
            required: true
        },
        flat: String
    },
    ukrPoshtaWarehouseAddress: {
        region: {
            type: String,
            required: true
        },
        district: String,
        city: {
            type: String,
            required: true
        },
        warehouse: {
            type: Number,
            required: true
        }
    },
    phoneNumber: String,
    instagramUsername: String,
    active: {
        type: Boolean,
        required: true
    }
});

export default models?.user || model('user', userSchema);
