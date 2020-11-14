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
  // clearTables(db); //use with caution
});

const configuration = {
  methods: ['POST'],
  origin: 'http://localhost:4200'
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

usersRoute(app, db, configuration);
expensesRoute(app, db, configuration);
expenseGroupsRoute(app, db, configuration);

app.get('/', cors(configuration), (req, res) => {
  res.send('ROOT');
});

app.listen(port, () => {
  console.log(`===== SERVER STARTED AT PORT ${port} =====`);
});
