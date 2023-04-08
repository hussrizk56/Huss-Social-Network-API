const { Schema, model } = require('mongoose');

//Create User collection
const UserSchema = new Schema({
    username:{
        type: String,
        required: [true,'Username is mandatory'],
        unique:true,
        trim: true
    },
    email:{
        type: String,
        required: [true,'email is mandatory'],
        unique:true,
        validate: {
            validator: function(v) {
              return /.+\@.+\..+/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
          }
    },
    thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Thought'
        }
    ],
    friends:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ]
},
{
    toJSON: {
      virtuals: true
    },
    id: false
  }  
);

// get total count of friends
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// create the User model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;