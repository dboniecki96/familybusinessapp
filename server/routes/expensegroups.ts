import cors       from 'cors';
import {Express}  from 'express';
import {Database} from 'sqlite3';

export const expenseGroupsRoute = (app: Express, db: Database, configuration: any) => {
  app.get('/expensesgroup', cors(configuration), (req, res) => {
    db.all('select * from expenses_group', (err: Error | null, row: any[]) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res.json(row);
      }
    });
  });

  app.get('/expensesgroup/:id', cors(configuration), (req, res) => {
    db.all('select * from expenses_group where id = ?', req.params.id, (err: Error, row: any[]) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res.json(row);
      }
    });
  });

  app.post('/expensesgroup', (req, res) => {
    db.run('insert into expenses_group(date,balance,money_left,name,percentage,budget,userID) values(?,?,?,?,?,?,?)',
      [req.body.date, req.body.balance, req.body.money_left, req.body.name, req.body.percentage, req.body.budget, req.body.userID], (err: Error) => {
        throw new Error(err.message);
      });
    res.send(req.body);
  });

  app.delete('/expensesgroup', (req, res) => {
    db.run('delete from expenses_group where id= (?)', [req.body.id], (err: Error) => {
      throw new Error(err.message);
    });
    res.send(req.body);
  });

};
