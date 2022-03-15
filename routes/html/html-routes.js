const router = require( 'express' ).Router();
const path = require( 'path' );

router.get( '/', ( req, res ) => {
  res.sendFile( path.join( __dirname, '../../public/home.html' ) );
} );
router.get( '/users', ( req, res ) => {
  res.sendFile( path.join( __dirname, '../../public/users.html' ) );
} );
router.get( '/thoughts', ( req, res ) => {
  res.sendFile( path.join( __dirname, '../../public/thoughts.html' ) );
} );

module.exports = router;
