import {Express}     from 'express';
import {Database}    from 'sqlite3';
import {verifyToken} from './users';

export const expensesRoute = (app: Express, db: Database) => {
  app.get('/expenses/:id', verifyToken, (req, res) => {
    db.all('select * from expenses where userID = ?', req.params.id, (err: Error | null, row: any[]) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(row);
      }
    });
  });

  app.post('/expenses', verifyToken, (req, res) => {
    db.run('insert into expenses(date,sum,userID,expensegroupID) values(?,?,?,?)', [req.body.date, req.body.sum, req.body.userID, req.body.expensegroupID], (err: Error, row: any[]) => {
      console.log(err, row);
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
        // db.run('update expenses_group set money_left=money_left -? where id= ?', [req.body.sum, req.body.expensegroupID], (secondErr: Error) => {
        //   if (secondErr) {
        //     console.log(secondErr);
        //     res.sendStatus(500).send(err);
        //   }
        // });
      }
    });
  });

  app.delete('/expenses/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    db.run('UPDATE expenses_group SET money_left=money_left+(select sum from expenses where id=?) where id=?', [req.params.id, req.body.id], (err: Error) => {
      if (err) {
        res.sendStatus(500);
      }
    });
    db.run('delete from expenses where id=?', id, (err: Error | null) => {
      if (err) {
        res.sendStatus(500);
      }
    });
    res.send(req.body);
  });
};
