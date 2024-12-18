const express = require('express')
const mysql = require('mysql')
const app = express()
const expressport = 3001

app.use(express.json())

const dataBase = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'root', 
    database: 'restaurantapi2',
})

dataBase.connect((err) =>{
    if (err){
        console.log('error');
    } else {
        console.log('Database 2 connected');
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
    
    dataBase.query(sql, [name, price, description], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'SERVER ERROR' });
        } 
        return res.status(200).json(results);
    });
});

app.put('/updateitems', (req, res) => {
    const { id, name, price, description } = req.body;
    const sql = 'UPDATE items SET name = ?, price = ?, description = ? WHERE id = ?';
    
    dataBase.query(sql, [name, price, description, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'SERVER ERROR'});
        }
        return res.status(200).json({ message: 'Item updated' });
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM items WHERE id = ?';
    
    dataBase.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'SERVER ERROR' });
        }
        return res.status(200).json({ message: 'Item deleted' });
    });
});
