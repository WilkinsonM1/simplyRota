//require essentials
const mysql = require('mysql')
const { promisify } = require('util')
const { password } = require("./passwords")

//connect to mysql
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: `${password}`,
    database: "simplyRota"
})

const promisifiedQuery = promisify(connection.query).bind(connection);

//* Methods
user = {
    first_name : "Ben",
    last_name : "Franklin",
    gender : "M",
    hours_contracted : 35,
    email : "ben@gmail.com",
    username : "Benfranco",
    user_password : "benny",
    job_title : "Assistant Carer",
    admin_status : "N",
    driving_status : "Y",
    skills : "Fortnight",
    annual_leave_entitlement: 25,


}

const addUser = async (user) => {
    //add user will take a object as an input, below are the variables that will be used in the query
    //this function will take req.body as an input which will have all the various inputs of info as key-value pairs
    try {

        // let comments= user.comments
        // took out comments otherwise if a comment isn't added upon user creation this will cause an error. This way comments are optional and can be added later.
        const queryStringAdd = `INSERT INTO staff (first_name,last_name,gender,hours_contracted,username,email,user_password,job_title,admin_status,driving_status,skills,annual_leave_entitlement)
        VALUES ('${user.first_name}',
        '${user.last_name}',
        '${user.gender}',
        '${user.hours_contracted}',
        '${user.username}',
        '${user.email}',
        '${user.user_password}',
        '${user.job_title}',
        '${user.admin_status}',
        '${user.driving_status}',
        '${user.skills}',
        '${user.annual_leave_entitlement}');`
        console.log(queryStringAdd)
        let data = await promisifiedQuery (queryStringAdd);
        console.log(data)
        return(data);
    }   catch (error) {
        console.log (error.sqlMessage);
    }
 };





// addUser(user)

// sign in function which checks whether username exists and returns their id and admin status
const signIn = async (username) => {

    try {
        const queryString = `SELECT id FROM staff WHERE username = '${username}'`;
        let data = await promisifiedQuery(queryString)

        if (data[0] !== undefined){
                console.log(data[0].id)
                return {
                    id: data[0].id,
                }
            }
        
        else { return ("Username doesnt exists")}
        }

    catch (error) {
        console.log('Sign in Error')
        console.log(error)
    }
    connection.end()
}



const addShift = async (clientFirst, clientLast, staffFirst, staffLast, startTime, endTime, shiftDate, hoursWorked)=>{
    try{
        let client_id = `SELECT id FROM clients WHERE first_name = ${clientFirst} AND last_name = ${clientLast}`
        let staff_id = `SELECT id FROM staff WHERE first_name = ${staffFirst} AND last_name = ${staffLast}`
        const queryString = `INSERT INTO shifts(start_time,end_time, shift_date,hours_worked, ${client_id}, ${staff_id}, comments)
        VALUES('${startTime}','${endTime}', '${shiftDate}' );`
        let data = await promisifiedQuery(queryString)
        console.log(data)
        return data
    }

    catch (error) {
        console.log('add shift error')
        return (error.code)
    }
}

const editShift = async (shift) => {

    let start = shift.start
    let end = shift.end
    let id = shift.id
    try{
        const queryString = `UPDATE shifts SET start_time='${start}', end_time='${end}' where id=${id}`;
        let data = await promisifiedQuery(queryString)
        
        console.log(data)
        console.log('edit shift')
        return data
    }

    catch (error) {
        console.log('edit reminder')
        console.log(error.sqlMessage)
    }

    connection.end()
}

const listShifts = async (shift_data) => {
    try {
        const queryStringAdd = `SELECT CONCAT (staff.first_name," ", staff.last_name) AS staff_name, start_time,end_time, shift_date, 
        CONCAT (clients.first_name, ' ', clients.last_name) as client_name, client_location
        FROM staff 
        JOIN shifts
        ON staff.id = shifts.staff_id
        JOIN clients
        ON shifts.client_id = clients.id
        WHERE shift_date = '${shift_data}';`
        let data = await promisifiedQuery (queryStringAdd)
        console.log(data)
        return data

    } catch (e) {
        console.log(e.sqlMessage)
    }
}

// listShifts('2019-10-18')

module.exports = {
    addUser,
    signIn,
    addShift,
    editShift,
    listShifts
}