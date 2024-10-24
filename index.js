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
    console.log('mon serveur tourne sur le port:', expressport)
});

app.get('/items', (req, res)=>{
   const sql = 'SELECT * FROM items;';
   dataBase.query(sql,(err,results) =>{
    if(err){
        return res.status(500).json({ error: 'ERREUR DU SERVEUR'});
    } else{
 return res.status(200).json(results);
    }
   });
});


app.post('/createitems', (req, res) => {
    const { name, price, id_category, description } = req.body;

    const sql = 'INSERT INTO items (name, price, id_category, description) VALUES (?, ?, ?, ?)';
    
    dataBase.query(sql, [name, price, id_category, description], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'ERREUR DU SERVEUR'});
        } 
        return res.status(200).json(results);
    });
});


app.put('/updateitems', (req, res) => {
    const { id, name, price, id_category, description } = req.body; 

    const sql = 'UPDATE items SET name = ?, price = ?, id_category = ?, description = ? WHERE id = ?';
    
    dataBase.query(sql, [name, price, id_category, description, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'ERREUR DU SERVEUR', details: err.sqlMessage });
        }
        return res.status(200).json({ message: 'Item updated' });
    });
});



app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM items WHERE id = ?';
    const value = [id];
     dataBase.query(sql, value, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'ERREUR DU SERVEUR' });
            }
            return res.status(200).json({ message: 'Item deleted' });
        });
    });
    
