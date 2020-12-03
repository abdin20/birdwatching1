const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();
var fs = require('fs');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'birdwatching'
});


//set static file directory
app.use(express.static(__dirname + '/html'));
//router will return json objects
router.use(express.json());
//send html file 
router.get('/', function (req, res) {
    res.sendFile("/index.html");


});

//login
router.get('/api/login/:username/:password', async (req, res) => {

    //get username and password
    var username = req.params.username;
    var password = req.params.password;

    //connect to query 
    connection.query(`SELECT * FROM USER WHERE username='${username}' && password='${password}'`, function (error, results, fields) {
        if (error) throw error;
        //if no result then login is invalid
        if (results.length === 0) {
            res.status(404).send("Invalid Login")
            return;
        } else {
            //else we found user and login was valid
            res.status(200).send("logged in")
        }

    });
})

//sign up route
router.get('/api/signup/:username/:password/:email/:phone', async (req, res) => {
    //get username and password
    var username = req.params.username;
    var password = req.params.password;
    var email = req.params.email;
    var phone = req.params.phone;



    //connect to query to see if username exists
    connection.query(`SELECT * FROM USER WHERE username='${username}'`, function (error, results, fields) {
        if (error) throw error;

        //if no results returned that means username doesnt exist
        if (results.length === 0) {
            //connect to query and insert into database the new user
            connection.query(`INSERT INTO user(username,email,password,phonenumber,userrank)
                VALUES ('${username}','${email}','${password}','${phone}',9999);`, function (error, results, fields) {
                if (error) throw error;
                res.status(200).send("Successful sign up")
            });
        } else {
            res.status(400).send("username exists")
            return;
        }
    });

})

router.get('/api/locationsearch/:description', async (req, res) => {

    //get description from req
    var description = req.params.description

    //query database
    connection.query(`SELECT locationnumber, description FROM location WHERE description LIKE '%${description}%'`, function (error, results, fields) {
        if (error) {
            throw error;
        }
        //if no results send error
        if (results.length === 0) {
            res.status(404).send("no results")
            return;
        } else {
            //else send the results
            res.status(200).send(results)
        }
    });
})

//get the rarest birds
router.get('/api/rarestbirds', async (req, res) => {

    //query database for rarest birds of the continent
    connection.query('SELECT birdname,continent, Max(rarity) FROM bird GROUP BY continent', function (error, results, fields) {
        if (error) throw error;
        res.status(200).send(results);
    });

})

//get all users that found specific bird
router.get('/api/findUser/:birdname', async (req, res) => {

    var birdname = req.params.birdname;

    //query database for distinct users that found the bird
    connection.query(`SELECT DISTINCT user.username,user.email,user.userrank FROM user INNER JOIN birdreport ON user.username=birdreport.username && birdreport.birdname='${birdname}'`, function (error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            res.status(400).send(`No bird reports found with bird name:  ${birdname}`);
            return;
        }
        res.status(200).send(results);
    });
})

//reques to submit report
router.get('/api/submitReport/:date/:username/:birdname/:locationnumber', async (req, res) => {

    //get info from request
    var date = req.params.date;
    var username = req.params.username;
    var birdname = req.params.birdname;
    var locationnumber = req.params.locationnumber;
    var reportID = Math.random().toString(36).slice(2)



    //check if birdname exists
    connection.query(`SELECT * FROM bird WHERE birdname='${birdname}'`, function (error, results, fields) {
        if (error) throw error;

        if (results.length === 0) {
            res.status(404).send(`Bird: ${birdname} does not exist`)
            return;
        } else {
            //check if location exists
            connection.query(`SELECT * FROM location WHERE locationnumber=${locationnumber}`, function (error, results, fields) {
                if (error) throw error;
                if (results.length === 0) {
                    res.status(404).send(`Location: ${locationnumber} does not exist`)
                    return;
                } else {

                    //insert into database
                    connection.query(`INSERT INTO birdreport(reportID,dateofreport,username,birdname,locationnumber) VALUES ('${reportID}','${date}', '${username}','${birdname}',${locationnumber})`, function (error, results, fields) {
                        if (error) throw error;
                        //send all users reports
                        connection.query(`SELECT * FROM birdreport WHERE username='${username}' `, function (error, results, fields) {
                            if (error) throw error;
                            res.status(200).send(results)
                        });
                    });

                }
            });
        }
    });
})

//get the user reports between 2 times
router.get('/api/searchTimeReport/:date1/:date2', async (req, res) => {

    //get inputs
    var date1 = req.params.date1;
    var date2 = req.params.date2;

    //check database for reports between said dates
    connection.query(`SELECT * FROM birdreport WHERE dateofreport BETWEEN CAST('${date1}' AS DATE) AND CAST('${date2}' AS DATE)`, function (error, results, fields) {
        if (error) throw error;

        //check if input was found
        if(results.length===0){
            res.status(404).send("No reports found")
            return;
        }else{
            //else send the results back
            res.status(200).send(results)
            return;
        }
      }); 
})

//use router 
app.use('/', router)

//start server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);

});