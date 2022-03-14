const router = require( 'express' ).Router();
const path = require( 'path' );

router.get( '/', ( req, res ) => {
  res.sendFile( path.join( __dirname, '../../public/home.html' ) );
} );
router.get( '/users', ( req, res ) => {
  res.sendFile( path.join( __dirname, '../../public/users.html' ) );
} );

module.exports = router;
