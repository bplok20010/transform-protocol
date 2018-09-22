import mysql from 'mysql';
import {
    DB_HOST,
    DB_USER,
    DB_PWD,
    DB_PORT,
    DB_DATABASE
} from '../config';


let pool;
pool = mysql.createPool({
    connectionLimit: 10,
    port: DB_PORT,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PWD,
    database: DB_DATABASE
});

export async function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
}

export async function find(sql, params) {
    const results = await query(sql, params);
    return results[0];
}