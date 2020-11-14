import cors       from 'cors';
import {Express}  from 'express';
import {Database} from 'sqlite3';

export const usersRoute = (app: Express, db: Database, configuration: any) => {
  app.get('/users', cors(configuration), (req, res) => {
    db.all('select * from user', (err: Error | null, row: any[]) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res.json(row);
      }
    });
  });

  app.post('/login', (req, res) => {
    db.all('select * from user where login = $login and password = $password', {
      $login: req.body.login,
      $password: req.body.password
    }, (err: Error | null, row: any[]) => {
      if (!row.length) {
        res.status(404).send('User not found!');
      } else {
        res.send({
          userID: row[0].userID
        });
      }
    });
  });

  app.post('/users', (req, res) => {
    db.run(`insert into user(name,surname,birth_date,residence,country,login,password,email) values(?,?,?,?,?,?,?,?)`,
      [req.body.name, req.body.surname, req.body.birth_date, req.body.residence, req.body.country, req.body.login, req.body.password, req.body.email], (err: Error) => {
        throw new Error(err.message);
      });
    res.send(req.body);
  });

  app.get('/users/:id', cors(configuration), (req, res) => {
    db.all('select * from user where userID = ?', req.params.id, (err: Error, row: any[]) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res.json(row);
      }
    });
  });
};
