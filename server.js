const express = require( 'express' );
const mongoose = require( 'mongoose' );

const app = express();
const PORT = process.env.PORT || 3001;
const IS_DEBUG = process.argv[ 2 ] === '-debug';

console.log( IS_DEBUG );

app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );
app.use( express.static( 'public' ) );

// app.use( require( './routes' ) );

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamtdb',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

mongoose.set( 'debug', IS_DEBUG );

app.listen( PORT, () => {
  PORT === 3001
    ? console.log( 'Connected on  localhost:' + PORT )
    : console.log( 'Connected on port ' + PORT );
} );
