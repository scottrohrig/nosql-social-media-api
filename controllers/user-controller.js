const { User, Thought } = require( '../models' );

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
      .then( dbUserData => res.json( dbUserData ) )
      .catch( err => res.status( 500 ).json( err ) );
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
      .then( dbUserData => {
        if ( !dbUserData ) {
          res.status( 404 ).json( { message: 'user not found' } );
          return;
        }
        res.json( dbUserData );
      } )
      .catch( err => res.status( 500 ).json( err ) );
  },

  createUser( { body }, res ) {
    User.create( body )
      .then( dbUserData => res.json( dbUserData ) )
      .catch( err => res.status( 500 ).json( err ) );
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
      .then( dbUserData => {
        if ( !dbUserData ) {
          res.status( 404 ).json( { message: 'user not found' } );
          return;
        }
        res.json( dbUserData );
      } )
      .catch( err => res.status( 500 ).json( err ) );

  },

  deleteUser( { params }, res ) {
    User.findOneAndDelete( { _id: params.id } )
      .then( ( { username } ) => {
        return Thought.deleteMany( { username } );
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
      .then( dbUserData => {
        if ( !dbUserData ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.status( 200 ).json( dbUserData );
      } )
      .catch( err => res.status( 500 ).json( err ) );
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
      .then( dbUserData => {
        if ( !dbUserData ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.status( 200 ).json( dbUserData );
      } )
      .catch( err => res.status( 500 ).json( err ) );
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
          .then( dbUserData => {
            if ( !dbUserData ) {
              res.status( 404 ).json( { message: 'not found' } );
              return;
            }
            res.status( 200 ).json( dbUserData );
          } )
          .catch( err => res.status( 500 ).json( err ) );
      } );
  },
};

module.exports = userController;
