import { Model, model, models, Schema } from 'mongoose';
import { BalanceEntity } from '@/lib/data/types';

const balanceSchema = new Schema<BalanceEntity, Model<BalanceEntity>>({
    value: {
        type: Number,
        required: true
    }
});

export default models.balance || model('balance', balanceSchema);
