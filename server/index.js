const express = require('express')
const app = express()
const port = 3000
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')


const schema = buildSchema(`
    type Query {
        hello : String
    }
`);

const returnString = {
    hello: () => {
        return 'Hello World';
    }
};


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/graphql', graphqlHTTP({
    schema : schema,
    rootValue : returnString,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`listen check ${port}`);
});