import {Express}  from 'express';
import {Database} from 'sqlite3';
import jwt        from 'jsonwebtoken';

const generateToken = (userID: string): string => {
  return jwt.sign(userID, 'Auth-Token');
};

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers['auth-token'].toString();
  const verify = jwt.verify(token, 'Auth-Token');
  if (verify) {
    next();
  } else {
    res.sendStatus(401);
  }
};

export const usersRoute = (app: Express, db: Database) => {
  app.get('/users', (req, res) => {
    db.all('select * from user', (err: Error | null, row: any[]) => {
      if (err) {
        res.sendStatus(500);
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
        const token = generateToken(row[0].userID);
        res.setHeader('Auth-Token', token);
        res.send({
          userID: row[0].userID
        });
      }
    });
  });

  app.post('/users', (req, res) => {
    db.run(`insert into user(name,surname,birth_date,residence,country,login,password,email) values(?,?,?,?,?,?,?,?)`,
      [req.body.name, req.body.surname, req.body.birth_date, req.body.residence, req.body.country, req.body.login, req.body.password, req.body.email], (err: Error) => {
        if (err) {
          res.sendStatus(500);
        }
      });
    res.send(req.body);
  });

  app.get('/users/:id', (req, res) => {
    db.all('select * from user where userID = ?', req.params.id, (err: Error, row: any[]) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(row);
      }
    });
  });
};
