const express = require("express");
const path = require("path");
const bodyParser = require('body-parser')

const port = process.env.PORT || 3003;

const {addUser, signIn, addShift, listShifts} = require("./app")


//?---------- incase of access cors error ==========?//
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     next();
// });

const app = express();
app.use(express.static(path.join(__dirname, "public/landing")))


//to allow HTTP requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.post("/register",  (req) => {
    let user = {
        first_name : req.body.firstName,
        last_name : req.body.lastName,
        gender : req.body.gender,
        hours_contracted :  req.body.hoursContracted,
        email : req.body.email,
        username : req.body.username,
        user_password : req.body.password,
        job_title :  req.body.jobTitle,
        admin_status :  req.body.adminAccess,
        driving_status : req.body.drivingStatus,
        skills : req.body.skills,
        annual_leave_entitlement: req.body.annualLeave
    }
    console.log(user)
    console.log(req.body)
    // addUser is only expected 1 parameter, 
    // so can't have a bunch of req.queries separated by commas.
    // Instead create a user object with the 
    // req.queries and use that as the function parameter.
    addUser(user)
    // console.log(data)
    console.log("user has been registered")
 });



//sign in
app.get("/signIn", async (req, res) => {
    let data = await signIn(req.query.username)
    res.send(data)
})

//display
app.get("/display", async (req, res) => {
    let data = await read(
        req.query.id
    )
    res.send(data)
})

//add shift
app.post("/addShift", async (req, res) => {

    let shift = {

    }
    req.query.employer,
        req.query.client,
        req.query.date,
        req.query.startTime,
        req.query.endTime
    addShift(
        shift
    )
    res.send(data)
    console.log("added shift")

})


//delete shift
app.get("/deleteShift", async (req, res) => {
    let data = await deleteShift(
        req.query.shift
    )
    res.send(data)
    console.log("deleted shift")
})

//list shifts for particular date

app.get("/list-shifts", async (req, res) => {
    let data = await listShifts(req.query.shift_date);
    console.log({data:data});
    res.send({data: data});
})

//url where server exists
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})
