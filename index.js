import express from 'express';
import cors from 'cors';
import mysql2 from 'mysql2'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

dotenv.config()

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.Router());

const db = mysql2.createConnection(process.env.DATABASE_URL);

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
    let fecha = req.query.fecha;

    console.log(fecha);
    
    fecha = fecha.replace("%20", " ");

    console.log(fecha);

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

app.post('/updateSensor', (req, res) => {
    const { fieldsToUpdate, fecha_hora } = req.body;

    // Ensure that fieldsToUpdate is an array
    if (!Array.isArray(fieldsToUpdate)) {
        return res.status(400).json({ message: 'Invalid input for fieldsToUpdate' });
    }

    // Construct SET part of the SQL query dynamically based on fieldsToUpdate
    const setClause = fieldsToUpdate.map(({ field, value }) => `${field}=?`).join(', ');

    // Create an array of values to replace placeholders in the SQL query
    const values = fieldsToUpdate.map(({ value }) => value);
    values.push(fecha_hora); // Add fecha_hora as the last parameter

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('Connected to MySQL as id ' + db.threadId);
    });

    db.query(
        `UPDATE sensores SET ${setClause} WHERE fecha_hora=?`,
        values,
        (error, results) => {
            if (error) {
                console.error('Error updating sensor data: ' + error.message);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (results.affectedRows > 0) {
                res.json({ message: 'Sensor data updated successfully' });
            } else {
                res.status(404).json({ message: 'Sensor not found with the provided fecha_hora' });
            }
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
