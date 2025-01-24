import { connect } from 'mongoose';

if (!process.env.BOOK_STORAGE_DATABASE_URL) {
    throw new Error("Please define the BOOK_STORAGE_DATABASE_URL environment variable inside .env");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        console.log('MongoDB is connected!');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        };

        cached.promise = connect(process.env.BOOK_STORAGE_DATABASE_URL, opts).then(mongoose => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;

    console.log('MongoDB is connected!');
    return cached.conn;
}

export default connectDB;
