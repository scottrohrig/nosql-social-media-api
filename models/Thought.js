const { Schema, model } = require( 'mongoose' );
const formatDate = require( '../utils/format-date' );

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: [ true, 'Must contain a reaction' ],
      max: [ 280, 'Oops, over the 280 character limit' ]
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => formatDate( createdAtVal )
    }
  },
  {
    toJSON: {
      getters: true
    },
  }
);

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
    reactions: [ ReactionSchema ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false
  }
);

ThoughtSchema.virtuals( 'reactionCount' ).get( function () {
  return this.reactions.length;
} );

const Thought = model( 'Thought', ThoughtSchema );

module.exports = Thought;
