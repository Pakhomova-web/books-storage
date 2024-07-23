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
    }
});

export default models.user || model('user', userSchema);
