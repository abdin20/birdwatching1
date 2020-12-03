

function login() {
  //get input from input box

  var x = document.getElementById("loggedin");
  var signup = document.getElementById("signup")
  var username = document.getElementById("username").value
  var password = document.getElementById("password").value

  ///check if username is right length
  if (!username || username.length === 0) {
    window.alert("please enter a username")
    return;
  }

  //check if password is proper 
  if (!password || password.length === 0) {
    window.alert("please enter a password")
    return;
  }
  fetch(`/api/login/${username}/${password}/`).then(res => {

    //if result is ok we send to next page
    if (res.ok) {
      x.style.display = "block"
      signup.style.display = "none"

    } else {
      //otherwise we send error text
      res.text().then(text => { window.alert(text) })

    }
  })
}


function signup() {
  //get input from input box
  var username = document.getElementById("signUpUsername").value
  var password = document.getElementById("signUpPassword").value
  var email = document.getElementById("signUpEmail").value
  var phone = document.getElementById("signUpPhoneNumber").value

  ///check if username is right length
  if (!username || username.length === 0 || !password || password.length === 0) {
    window.alert("please enter a username and password")
    return;
  }

  //check if email is valid
  if (!email || email.indexOf("@") < 0 || email.length === 0) {
    window.alert("please enter a valid email")
    return;
  }

  //check if phone is valid
  if (!phone || phone.length !== 10 || isNaN(phone)) {
    window.alert("please enter a phonenumber exactly 10 digits long. eg 4161234567")
    return;
  }


  fetch(`/api/signup/${username}/${password}/${email}/${phone}`).then(res => {
    //display output from server
    res.text().then(text => { window.alert(text) })
  })
}

// search location function
function searchLocation() {
  //get input from input box
  var description = document.getElementById("locationInput").value
  var locationDiv = document.getElementById("locationSearch");

  //empty old results
  locationDiv.innerHTML = "";

  //check input for description
  if (!description || description.length === 0) {
    window.alert("please enter a valid description")
    return;
  }

  // fetch data from backend
  fetch(`/api/locationsearch/${description}`).then(res => {
    //check if result is not error
    if (res.ok) {
      //convert result to json and print data to website
      res.json().then(result => {

        // for each location print the info
        result.forEach(x => {
          // create a paragraph element and add it to the div
          var paragraph = document.createElement("p")
          paragraph.textContent = `Location Number: ${x.locationnumber} Description: ${x.description}`
          locationDiv.appendChild(paragraph)
        })
      })
    } else {
      window.alert("No results")
    }
  })

}


function rarestBirds() {
  //get div we are gonna edit
  var rareBirdsDiv = document.getElementById("rarestBirdDiv");


  // fetch data from backend
  fetch('/api/rarestbirds').then(res => {
    //check if result is not error
    if (res.ok) {
      //convert result to json and print data to website
      res.json().then(result => {
        // for each location print the info
        result.forEach(x => {
          // create a paragraph element and add it to the div
          var paragraph = document.createElement("p")
          paragraph.textContent = `Bird: ${x.birdname} Description: ${x.continent}`
          rareBirdsDiv.appendChild(paragraph)
        })
      })
    } else {
      window.alert("No results")
    }
  })
}

//function for searching for user info
function searchUserBird() {
  //get input from input box
  var birdname = document.getElementById("birdFoundbyUser").value
  var searchUserBirdDiv = document.getElementById("searchUserBirdDiv");
  //empty the div
  searchUserBirdDiv.innerHTML = "";


  //check input for description
  if (!birdname || birdname.length === 0) {
    window.alert("please enter a valid birdname")
    return;
  }

  // fetch data from backend
  fetch(`/api/findUser/${birdname}`).then(res => {

    //check if result is not error
    if (res.ok) {
      //convert result to json and print data to website
      res.json().then(result => {
        // for each location print the info
        var title = document.createElement("h2")
        title.textContent = birdname;
        searchUserBirdDiv.appendChild(title)
        result.forEach(x => {
          // create a paragraph element and add it to the div
          var paragraph = document.createElement("p")
          paragraph.textContent = `Username: ${x.username} | Email: ${x.email} | User Rank :${x.userrank}`
          searchUserBirdDiv.appendChild(paragraph)
        })
      })
    } else {
      window.alert("No results")
    }
  })
}

function submitBirdReport() {
  //empty div
  var submitBirdReportDiv = document.getElementById("submitBirdReportDiv");
  //empty the div
  submitBirdReportDiv.innerHTML = "";

  //get username
  var username = document.getElementById("username").value

  //get input from input box
  var reportBirdName = document.getElementById("reportBirdName").value
  var reportlocationNumber = document.getElementById("reportlocationNumber").value
  var reportBirdDate = document.getElementById("reportBirdDate").value
  var reportBirdTime = document.getElementById("reportBirdTime").value


  ///check if reportBirdName is right length
  if (!reportBirdName || reportBirdName.length === 0) {
    window.alert("please enter a birdname")
    return;
  }

  //check if location number is a number
  if (!reportlocationNumber || isNaN(reportlocationNumber)) {
    window.alert("please enter a location number")
    return;
  } else {
    reportlocationNumber = parseInt(reportlocationNumber); // if it is a number convert to integer
  }

  //check if date entered
  if (!reportBirdDate || !reportBirdTime) {
    window.alert("please valid date and time")
    return;
  }

  var fullDate = reportBirdDate + " " + reportBirdTime + ":00"
  console.log(fullDate)
  // fetch data from backend
  fetch(`/api/submitReport/${fullDate}/${username}/${reportBirdName}/${reportlocationNumber}`).then(res => {

    //check if result is not error
    if (res.ok) {
      // convert result to json and print data to website
      res.json().then(result => {
        // for each location print the info
        var title = document.createElement("h2")
        title.textContent = "Birds Found by User"
        submitBirdReportDiv.appendChild(title)
        result.forEach(x => {
          // create a paragraph element and add it to the div
          var paragraph = document.createElement("p")
          paragraph.textContent = `Username: ${x.username} | Bird: ${x.birdname} | Time: ${x.dateofreport}`
          submitBirdReportDiv.appendChild(paragraph)
        })
      })
    } else {
      //print error if result was not ok
      res.text().then(text => { window.alert(text) })

    }
  })
}

//function when searching for reports of a user between two times
function searchTimeReport() {
  //get the inputs
  var findDateOne = document.getElementById("findDateOne").value
  var findDateTwo = document.getElementById("findDateTwo").value
  var findTimeOne = document.getElementById("findTimeOne").value
  var findTimeTwo = document.getElementById("findTimeTwo").value

  //empty div of results
  var searchUserReportTimeDiv=document.getElementById("searchUserReportTimeDiv")
  searchUserReportTimeDiv.innerHTML = "";

  //check if date entered
  if (!findDateOne || !findDateTwo || !findTimeOne || !findTimeTwo) {
    window.alert("please valid dates and times")
    return;
  }

  //convert to sql datetime format
  var fullDate1 = findDateOne + " " + findTimeOne + ":00"
  var fullDate2 = findDateTwo + " " + findTimeTwo + ":00"

fetch(`/api/searchTimeReport/${fullDate1}/${fullDate2}`).then(res => {

  //check if result is not error
  if (res.ok) {
    // convert result to json and print data to website
    res.json().then(result => {
      // for each location print the info
      var title = document.createElement("h2")
      title.textContent = `Reports found between ${fullDate1} AND ${fullDate2}` 
      searchUserReportTimeDiv.appendChild(title)
      result.forEach(x => {
        // create a paragraph element and add it to the div
        var paragraph = document.createElement("p")
        paragraph.textContent = `User: ${x.username} | Bird: ${x.birdname} | Time: ${x.dateofreport}`
        searchUserReportTimeDiv.appendChild(paragraph)
      })
    })
  } else {
    //print error if result was not ok
    res.text().then(text => { window.alert(text) })
  }
})

}