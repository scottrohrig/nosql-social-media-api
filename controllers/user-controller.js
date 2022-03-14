const { User } = require( '../models' );

const userController = {
  getAllUsers( req, res ) {
    User.find()
      .populate( {
        path: 'friends',
        select: '-__v'
      } )
      .populate( {
        path: 'thoughts',
        select: '-__v'
      } )
      .select( '-__v' )
      .then( d => res.json( d ) )
      .catch( e => res.status( 500 ).json( e ) );
  },
  getUserById( { params }, res ) {
    User.findOne( { _id: params.id } )
      .populate( {
        path: 'friends',
        select: '-__v'
      } )
      .populate( {
        path: 'thoughts',
        select: '-__v'
      } )
      .select( '-__v' )
      .then( d => {
        if ( !d ) {
          res.status( 404 ).json( { message: 'user not found' } );
          return;
        }
        res.json( d );
      } )
      .catch( e => res.status( 500 ).json( e ) );
  },
  createUser( { body }, res ) {
    User.create( body )
      .then( d => res.json( d ) )
      .catch( e => res.status( 500 ).json( e ) );
  },
  updateUser( { params, body }, res ) {
    User.findOneAndUpdate(
      { _id: params.id },
      body,
      {
        new: true,
        runValidators: true
      }
    )
      .then( d => {
        if ( !d ) {
          res.status( 404 ).json( { message: 'user not found' } );
          return;
        }
        res.json( d );
      } )
      .catch( e => res.status( 500 ).json( e ) );

  },
  deleteUser( { params }, res ) {
    User.findOneAndDelete( { _id: params.id } )
      .then( d => res.json( d ) )
      .catch( e => res.status( 500 ).json( e ) );
  },
};

module.exports = userController
