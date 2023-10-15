import express, { Request, Response } from 'express';
import cors from 'cors';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, onValue } from "firebase/database";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const firebaseConfig = {
    apiKey: "AIzaSyBclDs5GhHaouQ4YgDb3Xmd7p-dLI8IBAY",
    authDomain: "iotdb-e823a.firebaseapp.com",
    projectId: "iotdb-e823a",
    storageBucket: "iotdb-e823a.appspot.com",
    messagingSenderId: "841356106534",
    appId: "1:841356106534:web:5316ca365c6a646503bfe7",
    databaseURL: "https://iotdb-e823a-default-rtdb.firebaseio.com",
};

const fireApp = initializeApp(firebaseConfig);

app.get('/sensors', (req: Request, res: Response) => {
    const db = getDatabase();

    const starCountRef = ref(db);
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        res.status(200);
        res.send(data);
    });
});

app.post('/sensors', (req: Request, res: Response) => {
    const db = getDatabase();

    let data = req.body;

    update(ref(db), {
        alt: data.alt,
        x: data.x,
        y: data.y,
        tilt: data.tilt
    }).then(() => {
        res.status(200);
        res.send('Data Received: ' + JSON.stringify(data));
    });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// I have the previous express api in https://iotapi5.vercel.app
// How do i make a get request with ESP8266WiFi in arduino and save the data recieved
// in the variables float alt, float x, float y, float tilt