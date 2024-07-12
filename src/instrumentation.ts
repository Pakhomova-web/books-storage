import connectDB from './lib/data/connection';

export async function register() {
  await connectDB();
}