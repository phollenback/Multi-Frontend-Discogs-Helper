import express from 'express'
import recordRouter from './records/records.routes'
import collectionRouter from './collection/collection.routes'
import suggestionsRouter from './helpers/suggestions.routes'
import userRoutes from './users/users.routes'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'


dotenv.config();

const app = express();
const port = process.env.PORT;

console.log(port)
// enable all CORS request
app.use(cors());

// parse json bodies
app.use(express.json());
// parse URL encoded bodies
app.use(express.urlencoded({ extended: true }));

// add a set of security middleware
app.use(helmet());

console.log(process.env.MY_SQL_DB_DATABASE);

if(process.env.NODE_ENV == 'development') {
    // add logger middleware
    console.log(process.env.GREETING + ' in dev mode');
}

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Music API</h1>');
});

app.use('/', [recordRouter, collectionRouter, userRoutes, suggestionsRouter]);

// open the server at the defined port
app.listen(port, () => {
    // echo that the server is listening
    console.log('Example app listening at http://localhost:' + port);
})