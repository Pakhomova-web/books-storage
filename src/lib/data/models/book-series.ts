import { Model, model, models, Schema } from 'mongoose';
import { BookSeriesEntity } from '@/lib/data/types';

const bookSeriesSchema = new Schema<BookSeriesEntity, Model<BookSeriesEntity>>({
    name: {
        type: String,
        required: true
    },
    publishingHouse: {
        ref: 'publishingHouse',
        type: Schema.Types.ObjectId,
        required: true
    }
});

bookSeriesSchema.index({ name: 1, publishingHouse: 1 }, { unique: true });

export default models.bookSeries || model('bookSeries', bookSeriesSchema);
