import * as express from 'express';
import * as cors from 'cors';
import { client } from './database/database';
import { ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const PORT : number = process.env.PORT ? parseInt(process.env.PORT) : 3001 ;


const dbName : string = "TodoApp";
const collectionName : string = "user";
const database = client.db(dbName);
const collection = database.collection(collectionName);


app.post('/api/create', async (req, res) => {  
    const user = req.body;
    try{
        const insertOneUser = await collection.insertOne(user);
        res.json(insertOneUser);
    }
    catch(err) {
        res.status(500).json({ err: 'has been an error to try to create an user' });
    }
    
})

app.get('/api', async (req, res) => { 
    let list = [];
    try{
        const users = collection.find({}); 
        for await (const user of users){
            list.push(user); 
        }
        res.json(list);
    }
    catch(err){
        res.status(500).json({ err: 'has been an error to try to get the users' });
    }
})


app.patch('/api/update/:id', async (req, res) => {
    const id : string = req.params.id;
    const myObjectId = new ObjectId(id); 
    const findOneQuery : {_id : ObjectId} = {
        _id: myObjectId
    } 
    const updateDoc = {
        $set : req.body
    }
    try{
        const updateResult = await collection.updateOne(
            findOneQuery,
            updateDoc
        );
        res.json(updateResult);
    }
    catch(err){
        res.status(500).json({ err : `Something went wrong trying to update one document: ${err}`})
    }
})


app.delete('/api/delete/:id', async (req, res) => {
    const id : string = req.params.id;
    const objectId = new ObjectId(id);
    const deleteQuery = { _id : objectId };
    try{
        const deleteResult = await collection.deleteOne(deleteQuery)
        res.status(200).json(deleteResult);
    }
    catch (err){
        res.status(400).json({ err : `Something went wrong trying to delete documents: ${err}`})
    }
})

client.connect()
.then(() => {
    app.listen(PORT, () => {
        console.log(`the application is listening the port ${PORT}`);
    })
})
.catch((err) => {
    console.error(err);
})
