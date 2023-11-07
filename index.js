import express from 'express';
import cors from 'cors';
import mysql2 from 'mysql2'
import dotenv from 'dotenv'

const app = express();
const port = 3000;

dotenv.config()

app.use(cors());
app.use(express.json());

const db = mysql2.createConnection(process.env.DATABASE_URL)

app.get('/getLugar', (req, res) => {
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('Connected to MySQL as id ' + db.threadId);
    });

    db.query('SELECT * FROM lugar', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/getEficiencia', (req, res) => {
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('Connected to MySQL as id ' + db.threadId);
    });

    db.query('SELECT * FROM eficiencia', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/getSensores', (req, res) => {
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('Connected to MySQL as id ' + db.threadId);
    });

    db.query('SELECT * FROM sensores', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/getSensor', (req, res) => {
    const fecha = req.query.fecha;

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('Connected to MySQL as id ' + db.threadId);
    });

    db.query('SELECT * FROM sensores WHERE fecha_hora = ?', [fecha], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/setSensor', (req, res) => {
    const { temperatura, humedad, orientacion, luz, id_lugar, fecha_hora } = req.body;

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('Connected to MySQL as id ' + db.threadId);
    });

    db.query('INSERT INTO sensores (temperatura, humedad, orientacion, luz, id_lugar, fecha_hora) VALUES (?, ?, ?, ?, ?, ?)',
        [temperatura, humedad, orientacion, luz, id_lugar, fecha_hora],
        (error, results) => {
            if (error) throw error;
            res.json({ message: 'Sensor data inserted successfully' });
        }
    );
});

app.post('/setLugar', (req, res) => {
    const { latitud, longitud } = req.body;

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('Connected to MySQL as id ' + db.threadId);
    });

    db.query('INSERT INTO lugar (latitud, longitud) VALUES (?, ?)',
        [latitud, longitud],
        (error, results) => {
            if (error) throw error;
            res.json({ message: 'Lugar data inserted successfully' });
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
