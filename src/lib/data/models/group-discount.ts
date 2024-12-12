import { Model, model, models, Schema } from 'mongoose';
import { GroupDiscountEntity } from '@/lib/data/types';

const groupDiscountSchema = new Schema<GroupDiscountEntity, Model<GroupDiscountEntity>>({
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'book',
        required: true
    }],
    discount: {
        type: Number,
        required: true
    }
});

export default models?.groupDiscount || model('groupDiscount', groupDiscountSchema);
