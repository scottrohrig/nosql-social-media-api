const { User } = require( '../models' );

const userController = {
  getAllUsers( req, res ) {
    User.find()
      .populate( {
        path: 'friends',
        select: [ '-__v' ]
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
      .then( ( { email } ) => {
        return Thought.deleteMany( { email } );
      } )
      .then( () => {
        return User.updateMany(
          { friends: { _id: params.id } },
          { $pull: { friends: params.id } },
          {
            new: true,
            runValidators: true
          },
        );
      } )
      .then( d => res.json( d ) )
      .catch( e => res.status( 500 ).json( e ) );
  },

  // Route /api/users/:userId/friends/:friendId
  addFriend( { params }, res ) {
    // add friend to user
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      {
        new: true,
        runValidators: true
      }
    )
      .then( () => {
        // add user as friend to friend
        return User.findOneAndUpdate(
          { _id: params.friendId },
          { $push: { friends: params.userId } },
          {
            new: true,
            runValidators: true
          }
        );
      } )
      .then( d => {
        if ( !d ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.status( 200 ).json( d );
      } )
      .catch( e => res.status( 500 ).json( e ) );
  },
  removeFriend( { params }, res ) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      {
        new: true,
        runValidators: true
      },
    )
      .then( () => {
        return User.findOneAndUpdate(
          { _id: params.friendId },
          { $pull: { friends: params.userId } },
          {
            new: true,
            runValidators: true
          },
        )
          .then( d => {
            if ( !d ) {
              res.status( 404 ).json( { message: 'not found' } );
              return;
            }
            res.status( 200 ).json( d );
          } )
          .catch( e => res.status( 500 ).json( e ) );
      } );
  },
};

module.exports = userController;
