import express              from 'express';
import bodyParser           from 'body-parser';
import cors                 from 'cors';
import {verbose}            from 'sqlite3';
import {usersRoute}         from './routes/users';
import {expensesRoute}      from './routes/expenses';
import {expenseGroupsRoute} from './routes/expensegroups';

const port = process.env.PORT || 3000;
const app = express();
const sql = verbose();
const db = new sql.Database('database.db', (err: Error | null) => {
  console.log(err ? 'Could not connect to database' : 'Connected to database! :)');
});

const configuration = {
  methods: ['POST', 'DELETE'],
  origin: 'http://localhost:4200',
  exposedHeaders: ['Auth-Token']
};

app.use(cors(configuration));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

usersRoute(app, db);
expensesRoute(app, db);
expenseGroupsRoute(app, db);

app.get('/', cors(configuration), (req, res) => {
  res.send('ROOT');
});

app.listen(port, () => {
  console.log(`===== SERVER STARTED AT PORT ${port} =====`);
});
