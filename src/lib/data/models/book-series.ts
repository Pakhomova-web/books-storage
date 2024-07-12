import { Model, model, models, Schema } from 'mongoose';
import { BookSeriesEntity } from '@/lib/data/types';

const bookSeriesSchema = new Schema<BookSeriesEntity, Model<BookSeriesEntity>>({
    name: {
        type: String,
        required: true
    },
    publishingHouseId: {
        ref: 'publishingHouse',
        type: Schema.Types.ObjectId,
        required: true
    }
});

bookSeriesSchema.index({ name: 1, publishingHouseId: 1 }, { unique: true });

export default models.bookSeries || model('bookSeries', bookSeriesSchema);
