const mongoose = require('mongoose');
const LabourSchema = new mongoose.Schema({
    labourid: {
        type: String,
        unique: true
    },
    labourname: {
        type: String
    },
    data: [{
        
        date: {
            type: String,
        },
        lot: {
            type: String,
        },
        wages: {
            type: String,
        },
        amount: {
            type: String
        },
        gas: {
            type: String,
        },
        cashrec: {
            type: String,
        },
        totalamount: {
            type: String,
        },
    }],
}, {timestamps: true});
mongoose.models={}
export default mongoose.model("Labour", LabourSchema);
