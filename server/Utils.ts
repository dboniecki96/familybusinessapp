import {Database} from 'sqlite3';

export const clearTables = (db: Database) => {
  db.run('delete from expenses_group', () => {
    console.log('Expenses_group table cleared');
  });
  db.run('delete from user', () => {
    console.log('Users table cleared');
  });
  db.run('delete from expenses', () => {
    console.log('Expenses table cleared');
  });
};
