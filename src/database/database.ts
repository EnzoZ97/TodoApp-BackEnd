import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();
let url : string | undefined = process.env.MONGO_URI;
export const client = new MongoClient(String(url));