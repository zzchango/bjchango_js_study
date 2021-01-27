/*
winston을 사용해서 로그를 기록해 보세요.
(https://github.com/winstonjs/winston)
*/
const express = require('express')

const app = express()
const port = 3000
const { ApolloServer, gql } = require('apollo-server-express');
const config = require('./config/db_config.json');
const mysql = require('mysql2/promise');
const pool = mysql.createPool(config);

const getQuery = async ( _param ) => {
    let connection = await pool.getConnection(async conn => conn);
    try{ 
        const rows = await connection.query(_param);
        connection.release();
        return rows[0];
    } catch ( err ) {
        console.log(err);
        connection.release();
        return false;
    }
};

const typeDefs = gql`
    type Query {
        userFind: UserType
    }
    type UserType {
        id: String
        name: String
        email: String
    }
`

const resolvers = {
    Query: { 
        userFind : async () => {
            const query = "SELECT id,name,email FROM TB_USER";
            let sendData = await getQuery(query)
            return sendData[0];
        }
    }
}

//아폴로 서버 생성
const server = new ApolloServer({ typeDefs, resolvers });
const path = '/user';

// app.use(query());
server.applyMiddleware({ app, path });


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`listen check ${port}`);
});
