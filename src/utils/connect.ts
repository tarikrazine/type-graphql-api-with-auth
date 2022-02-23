import mongoose from 'mongoose';
import config from 'config';

async function connect() {
  const dbUri = config.get<string>('dbUri');
  try {
    await mongoose.connect(dbUri);
    console.log('Database connected with success');
  } catch (error: any) {
    console.log(error, 'Database not connected');
    process.exit(1);
  }
}

export default connect;
