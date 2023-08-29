const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
    customerid: {
        type: String,
        unique: true
    },
    customername: {
        type: String
    },
    phoneno: {
        type: String
    },
    data: [{
        numberid: {
            type: String,
        },
        salesdate: {
            type: String,
        },
        drivername: {
            type: String
        },
        autono: {
            type: String
        },
        Limea: {
            type: String
        },
        LimeaPrice: {
            type: String
        },
        Limew: {
            type: String
        },
        LimewPrice: {
            type: String
        },
        Limeb: {
            type: String
        },
        LimebPrice: {
            type: String
        },
        jhiki: {
            type: String
        },
        jhikiPrice: {
            type: String
        },
        rs: {
            type: String
        },
        rsPrice: {
            type: String
        },
        siteaddress: {
            type: String
        },
        labourcharge: {
            type: String
        },
        autocharge: {
            type: String
        },
        amount: {
            type: String
        },
        dr: {
            type: String
        },
        cr: {
            type: String
        },
        balance: {
            type: String
        }
    }],
}, {timestamps: true});
mongoose.models={}
export default mongoose.model("Customer", CustomerSchema);
