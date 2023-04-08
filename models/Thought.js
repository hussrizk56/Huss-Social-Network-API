const { Schema, model,Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//create Reaction subdocument schema
const ReactionSchema = new Schema({
 // set custom id to avoid confusion with parent thought _id

reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId()
},
reactionBody:{
    type: String,
    required: [true,'Reaction body is mandatory'],
    trim: true,
    minlength:1,
    maxlength:280
},
username:{
    type: String,
    required: [true,'Username is mandatory'],
    trim: true
},
createdAt:{
    type: Date,
    default: Date.now,
    get: (createdAtVal) => dateFormat(createdAtVal)
}
},
{
    toJSON: {
      getters: true
    }
} 
);


//Create Thought collection
const ThoughtSchema = new Schema({

    thoughtText:{
        type: String,
        required: [true,'ThoughText is mandatory'],
        trim: true,
        minlength:1,
        maxlength:280
    },
    createdAt:{
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    username:{
        type: String,
        required: [true,'Username is mandatory'],
        trim: true
    },
    reactions:[ReactionSchema]
},
{
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }  
);

// get total count of friends
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

// create the Thought model using the ThoughtSchema
const Thought = model('Thought', ThoughtSchema);

// export the Thought model
module.exports = Thought;