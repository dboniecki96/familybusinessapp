let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./database.db');

const configuration = {
    methods: ['POST'],
    origin: 'http://localhost:4200'
}
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
console.log('Registering root: /');
app.get('/',cors(configuration),(req,res)=>{
    res.send('ROOT');
});

//USERS
console.log('Registering users: /users');
app.get('/users',cors(configuration),(req,res)=>{
    db.all('select * from user',(err,row)=>{
        if(err) console.log(err);
        else{
            res.json(row);
        }
    })
});
app.post('/users',(req,res)=>{
    db.run(`insert into user(name,surname,birth_date,residence,country,login,password,email) values(?,?,?,?,?,?,?,?)`,
        [req.body.name,req.body.surname,req.body.birth_date,req.body.residence,req.body.country,req.body.login,req.body.password,req.body.email],(err)=>{
        console.log(err);
    });
    res.send(req.body);
    console.log('User added: ' + req.body.login);
    
});
app.post('/users/:id',(req,res)=>{
    res.redirect('/summary/:id' + req.params.id);
});
app.get('/users/:id',cors(configuration),(req,res)=>{
    db.all('select * from user where userID = ?',req.params.id,(err,row)=>{
        if(err) console.log(err);
        
        else{
            res.json(row);
        }
    });
});

//EXPENSES
console.log('Registering users: /expenses');
app.get('/expenses',cors(configuration),(req,res)=>{
    db.all('select * from expenses',(err,row)=>{
        if(err) console.log(err);
        else res.json(row);
    });
});
app.get('/expenses/:id',cors(configuration),(req,res)=>{
    db.all('select * from expenses where id = ?',req.params.id,(err,row)=>{
        if(err) console.log(err);
        
        else{
            res.json(row);
            console.log('Selected expense with id = '+req.params.id)
        }
    });
});
app.post('/expenses',(req,res)=>{
    db.run('insert into expenses(date,sum,userID,expensegroupID) values(?,?,?,?)',[req.body.date,req.body.sum,req.body.userID,req.body.expensegroupID],(err)=>{
        console.log(err);
    });
    db.run('update expenses_group set money_left=money_left -? where id= ?',[req.body.sum,req.body.expensegroupID],(err)=>{
        if(err) console.log(err);
        else console.log('group id: '+req.body.expensegroupID);
    })
    res.send(req.body);
    console.log('Expense added: ' + req.body.sum);
});
app.delete('/expenses/:id',(req,res)=>{
    let id = req.params.id;
    db.run('UPDATE expenses_group SET money_left=money_left+(select sum from expenses where id=?) where id=?',[req.params.id,req.body.id],(err)=>{
        if(err) console.log(err);
        else console.log(req.body.money_left);
    });
    db.run('delete from expenses where id=?',id,(err)=>{
        if(err) console.log(err);
        else console.log('deleted expense of id: '+ id);
    });
    
    res.send(req.body);
})

//EXPENSE GROUPS
console.log('Registering users: /expenses_group');
app.get('/expensesgroup',cors(configuration),(req,res)=>{
    db.all('select * from expenses_group',(err,row)=>{
        if(err) console.log(err);
        else res.json(row);
    })
});
app.get('/expensesgroup/:id',cors(configuration),(req,res)=>{
    db.all('select * from expenses_group where id = ?',req.params.id,(err,row)=>{
        if(err) console.log(err);
        
        else{
            res.json(row);
            console.log('Selected user with id = '+req.params.id)
        }
    });
});
app.post('/expensesgroup',(req,res)=>{
    db.run('insert into expenses_group(date,balance,money_left,name,percentage,budget,userID) values(?,?,?,?,?,?,?)',
        [req.body.date,req.body.balance,req.body.money_left,req.body.name,req.body.percentage,req.body.budget,req.body.userID],(err)=>{
            console.log(err);
        });
        console.log('USER ID: '+req.body.userID);
        res.send(req.body);
        console.log('Expense group added '+ req.body);
});
app.delete('/expensesgroup',(req,res)=>{
    db.run('delete from expenses_group where id= (?)',[req.body.id],(err)=>{
        console.log(err);
    });
    res.send(req.body);
    console.log('Expense Group deleted at id = ' + req.body.id);
});
console.log('Registering expenses: /expenses')
app.listen(3000);