import {Express}     from 'express';
import {Database}    from 'sqlite3';
import {verifyToken} from './users';

export const expenseGroupsRoute = (app: Express, db: Database) => {
  app.get('/expensesgroup/:id', verifyToken, (req, res) => {
    db.all('select * from expenses_group where userID = ?', req.params.id, (err: Error, row: any[]) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(row);
      }
    });
  });

  app.post('/expensesgroup', verifyToken, (req, res) => {
    db.run('insert into expenses_group(date,balance,money_left,name,percentage,budget,userID) values(?,?,?,?,?,?,?)',
      [req.body.date, req.body.balance, req.body.money_left, req.body.name, req.body.percentage, req.body.budget, req.body.userID], (err: Error) => {
        if (err) {
          console.log(err.message);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
  });

  app.delete('/expensesgroup/:id', verifyToken, (req, res) => {
    db.run('delete from expenses_group where id= (?)', (err: Error) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });

};
