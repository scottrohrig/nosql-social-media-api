const router = require( 'express' ).Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require( '../../controllers/thought-controller' );

// all thoughts
router.route( '/' )
  .get( getAllThoughts )
  .post( createThought );

router.route( '/:id' )
  .get( getThoughtById )
  .put( updateThought )
  .delete( deleteThought );

router.route( '/:thoughtId/reactions' )
  .post( addReaction );

router.route( '/:thoughtId/reactions/:reactionId' )
  .delete( removeReaction );

module.exports = router;
