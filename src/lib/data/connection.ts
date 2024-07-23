import { connect } from 'mongoose';
import { keys } from '@/config/keys';

const DATABASE_URL = keys.mongoURI;

if (!DATABASE_URL) {
    throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    console.log('connectDB');
    if (cached.conn) {
        console.log('MongoDB is connected!');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        cached.promise = connect(DATABASE_URL, opts).then(mongoose => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;

    console.log('MongoDB is connected!');
    return cached.conn;
}

export default connectDB;
