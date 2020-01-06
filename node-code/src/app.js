const express = require("express");
const mysql = require("mysql");
const app = express();

app.set("view engine", "hbs");

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    port: "3306", // Port mysql
    database: "users_db",
});

db.connect( (error) => {
    if (error) {
        console.log (error);
    } else {
        console.log("MySQL connected!");
    }
});

app.get("/", (request, response) => {
    db.query("SELECT * FROM users", (error, result) => {
        if (error) {
            console.log("Error in the query");
        } else {
            response.render("index", {
                db_return: result
            });
        }
    });
});

app.get("/register", (request, response) => {
    response.render("register");
});

app.post("/register", (request, response) => {
    const name = request.body.theUserName;
    const email = request.body.theUserEmail;
    const password = request.body.theUserPassword;
    
    let sql = "INSERT INTO users SET user_name = ?, email = ?, user_password = ?"
    let user = [name, email, password];
    let sqlQueryEmail = "SELECT email FROM users WHERE email = ?";
    db.query(sqlQueryEmail, email, (error, result) => {
        if (error) {
            console.log("error");
        } else {
            if (result.length > 0) {
                response.send("Sorry, that email has already been used to register a user on this website"); 
            } else {
                db.query(sql, user, (error, result) =>{
                    if (error) {
                        console.log("Error in the query");
                    } else {
                        response.send("<h1>User Registered<h1>");
                    }       
                });
            }
        }
    });    
});

app.post("/edit/:id", (request, response) => {
    
    const userId = request.params.id;
    const method = request.body._method;
    const newName = request.body.editName;

    let sql = "UPDATE users SET user_name = ? WHERE id = ?";
    let userUpdate = [newName, userId];

    if (method === "put") {
        db.query(sql, userUpdate, (error, rows) => {
            if (error) {
                console.log("There is an error in your query");
            } else {
                response.send("User name has been updated");
            }
        });
    };
});

app.listen(3000, () => {
    console.log("Server is running");
});

