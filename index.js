const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000

let db_config = {
    host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
    user: 'bsale_test',
    password: 'bsale_test',
    database: 'bsale_test'
};

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config);

    connection.connect(function(err) {
        if(err) {
            setTimeout(handleDisconnect, 2000);
        }
        else {
            console.log('connected to db');
        }
    });

    connection.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

app.get("/api/productos", async (req, res) => {
    connection.query(`SELECT * FROM product`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/api/productos/:id", async (req, res) => {
    const { id } = req.params;
    connection.query(`SELECT * FROM product WHERE category = ${id}`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/api/categorias", async (req, res) => {
    connection.query("SELECT * FROM category", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/api/categorias/:id", async (req, res) => {
    const { id } = req.params;
    connection.query(`SELECT * FROM category`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                id: result.find(item => item.name === id).id
            });
        }
    });
});

app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})