const { Thought, User } = require( '../models' );

const thoughtController = {
  getAllThoughts( req, res ) {
    Thought.find()
      .select( '-__v' )
      .sort( { _id: -1 } )
      .then( dbThoughtData => res.status( 200 ).json( dbThoughtData ) )
      .catch( err => res.status( 500 ).json( err ) );
  },
  getThoughtById( { params }, res ) {
    Thought
      .findById( params.id )
      .select( '-__v' )
      .then( dbThoughtData => {
        if ( !dbThoughtData ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.status( 200 ).json( dbThoughtData );
      } )
      .catch( err => res.status( 500 ).json( err ) );
  },
  createThought( { body }, res ) {
    Thought.create( body )
      .then( ( { _id } ) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
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
        res.json( dbUserData );
      } )
      .catch( err => res.status( 500 ).json( err ) );
  },
  updateThought( { params, body }, res ) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      body,
      {
        new: true,
        runValidators: true
      }
    )
      .then( dbThoughtData => res.status( 200 ).json( dbThoughtData ) )
      .catch( err => res.status( 500 ).json( err ) );
  },
  deleteThought( { params }, res ) {
    Thought.findOneAndDelete( { _id: params.id } )
      .then( dbThoughtData => {
        if ( !dbThoughtData ) {
          res.status( 404 ).json( { message: 'no thought found' } );
          return;
        }
        res.status( 200 ).json( dbThoughtData );
      } )
      .catch( err => res.status( 500 ).json( err ) );
  },

  addReaction( { params, body }, res ) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      {
        new: true,
        runValidators: true
      }
    )
      .then( dbThoughtData => {
        if ( !dbThoughtData ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.json( dbThoughtData );
      } )
      .catch( err => res.status( 500 ).json( err ) );

  },
  removeReaction( { params }, res ) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true },
    )
      .then( dbThoughtData => {
        if ( !dbThoughtData ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.json( dbThoughtData );
      } )
      .catch( err => res.status( 500 ).json( err ) );
  },
};

module.exports = thoughtController;
