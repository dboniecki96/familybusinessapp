import cors       from 'cors';
import {Express}  from 'express';
import {Database} from 'sqlite3';

export const expensesRoute = (app: Express, db: Database, configuration: any) => {
  app.get('/expenses', cors(configuration), (req, res) => {
    db.all('select * from expenses', (err: Error | null, row: any[]) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res.json(row);
      }
    });
  });
  app.get('/expenses/:id', cors(configuration), (req, res) => {
    db.all('select * from expenses where id = ?', req.params.id, (err: Error | null, row: any[]) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res.json(row);
      }
    });
  });
  app.post('/expenses', (req, res) => {
    db.run('insert into expenses(date,sum,userID,expensegroupID) values(?,?,?,?)', [req.body.date, req.body.sum, req.body.userID, req.body.expensegroupID], (err: Error) => {
      throw new Error(err.message);
    });
    db.run('update expenses_group set money_left=money_left -? where id= ?', [req.body.sum, req.body.expensegroupID], (err: Error) => {
      if (err) {
        throw new Error(err.message);
      }
    });
    res.send(req.body);
  });

  app.delete('/expenses/:id', (req, res) => {
    const id = req.params.id;
    db.run('UPDATE expenses_group SET money_left=money_left+(select sum from expenses where id=?) where id=?', [req.params.id, req.body.id], (err: Error) => {
      if (err) {
        throw new Error(err.message);
      }
    });
    db.run('delete from expenses where id=?', id, (err: Error | null) => {
      if (err) {
        throw new Error(err.message);
      }
    });
    res.send(req.body);
  });
};
