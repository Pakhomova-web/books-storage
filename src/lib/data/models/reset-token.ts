import { Model, model, models, Schema } from 'mongoose';
import { ResetTokenEntity } from '@/lib/data/types';

const resetTokenSchema = new Schema<ResetTokenEntity, Model<ResetTokenEntity>>({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    expiresAt: {
        type: String,
        required: true
    }
});

export default models?.resetToken || model('resetToken', resetTokenSchema);
