const { Schema, model } = require( 'mongoose' );
const formatDate = require( '../utils/format-date' );

const ThoughtSchema = new Schema(
  {
    thoughText: {
      type: String,
      required: 'Must contain a message',
      min: [ 1, 'Type somthing!' ],
      max: [ 280, 'Oops, over 280 character limit...' ]
    },
    username: {
      type: String,
      required: [ true, 'username is required' ]
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: ( createdAtVal ) => formatDate( createdAtVal )
    },
    reactions: []
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false
  }
);
