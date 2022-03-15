const { Thought, User } = require( '../models' );

const thoughtController = {
  getAllThoughts( req, res ) {
    Thought.find()
      .select( '-__v' )
      .sort( { _id: -1 } )
      .then( d => res.status( 200 ).json( d ) )
      .catch( e => res.status( 500 ).json( e ) );
  },
  getThoughtById( { params }, res ) {
    Thought
      .findById( params.id )
      .select( '-__v' )
      .then( d => {
        if ( !d ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.status( 200 ).json( d );
      } )
      .catch( e => res.status( 500 ).json( e ) );
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
      .then( d => {
        if ( !d ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.json( d );
      } )
      .catch( e => res.status( 500 ).json( e ) );
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
      .then( d => res.status( 200 ).json( d ) )
      .catch( e => res.status( 500 ).json( e ) );
  },
  deleteThought( { params }, res ) {
    Thought.findOneAndDelete( { _id: params.id } )
      .then( d => {
        if ( !d ) {
          res.status( 404 ).json( { message: 'no thought found' } );
          return;
        }
        res.status( 200 ).json( d );
      } )
      .catch( e => res.status( 500 ).json( e ) );
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
      .then( d => {
        if ( !d ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.json( d );
      } )
      .catch( e => res.status( 500 ).json( e ) );

  },
  removeReaction( { params }, res ) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true },
    )
      .then( d => {
        if ( !d ) {
          res.status( 404 ).json( { message: 'not found' } );
          return;
        }
        res.json( d );
      } )
      .catch( e => res.status( 500 ).json( e ) );
  },
};

module.exports = thoughtController;
