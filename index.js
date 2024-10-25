const axios = require('axios')
const express = require('express')
const mysql = require('mysql')
const app = express()
const expressport = 3000

app.use(express.json())

const dataBase = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'root', 
    database: 'restaurantapi',
})

dataBase.connect((err) =>{
    if (err){
        console.log('error');
    } else {
        console.log('Database 1 connected');
    }
});

app.listen(expressport, () => {
    console.log('Server running on port:', expressport)
});

app.get('/items', (req, res)=>{
   const sql = 'SELECT * FROM items;';
   dataBase.query(sql,(err,results) =>{
    if(err){
        return res.status(500).json({ error: 'SERVER ERROR'});
    } else{
        return res.status(200).json(results);
    }
   });
});

app.post('/createitems', (req, res) => {
    const { name, price, description } = req.body;
    const sql = 'INSERT INTO items (name, price, description) VALUES (?, ?, ?)';

    
    dataBase.query(sql, [name, price, description], async (err, results) => {
        if (err) {
            console.error('Error inserting into Database 1:', err);
            return res.status(500).json({ error: 'SERVER ERROR', details: err.message });
        }

      
        try {
            await axios.post('http://localhost:3001/createitems', { 
                name, 
                price, 
                description 
            });
        } catch (error) {
            console.log('Error syncing with Database 2:', error.message);
            return res.status(500).json({ error: 'Error connecting with Database 2'});
        }

        return res.status(200).json(results);
    });
});

app.put('/updateitems', (req, res) => {
    const { id, name, price, description } = req.body;
    const sql = 'UPDATE items SET name = ?, price = ?, description = ? WHERE id = ?';
    
    dataBase.query(sql, [name, price, description, id], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'SERVER ERROR' });
        }

        try {
            await axios.put('http://localhost:3001/updateitems', { 
                id, 
                name, 
                price, 
                description 
            });
        } catch (error) {
            console.log('Error syncing with Database 2:', error.message);
        }

        return res.status(200).json({ message: 'Item updated' });
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM items WHERE id = ?';
    
    dataBase.query(sql, [id], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'SERVER ERROR' });
        }

        try {
            await axios.delete(`http://localhost:3001/delete/${id}`);
        } catch (error) {
            console.log('Error syncing with Database 2:', error.message);
        }

        return res.status(200).json({ message: 'Item deleted' });
    });
});
