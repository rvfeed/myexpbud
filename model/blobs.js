/**
 * Created by Raj on 9/6/2015.
 */
var mongoose = require('mongoose');
var blobSchema = new mongoose.Schema({
    name: String,
    type: String,
    item:String,
    price: Number,
    date: { type: Date, default: Date.now },
    isloved: Boolean
});
mongoose.model('Blob', blobSchema);
