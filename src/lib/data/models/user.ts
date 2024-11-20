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
    basketItems: [{
        bookId: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    phoneNumber: String,
    postcode: Number,
    novaPostOffice: Number,
    region: String,
    city: String,
    preferredDeliveryId: String
});

export default models?.user || model('user', userSchema);
