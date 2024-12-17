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
        warehouse: Number,
        region: String,
        district: String,
        city: String
    },
    novaPoshtaCourierAddress: {
        region: String,
        district: String,
        city: String,
        street: String,
        house: String,
        flat: String
    },
    ukrPoshtaWarehouseAddress: {
        region: String,
        district: String,
        city: String,
        warehouse: Number
    },
    phoneNumber: String,
    instagramUsername: String,
    active: {
        type: Boolean,
        required: true
    }
});

export default models?.user || model('user', userSchema);
