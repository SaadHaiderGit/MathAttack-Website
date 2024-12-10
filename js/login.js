//PURPOSE: for login.html

//check for logged in user, send directly to homepage if found
console.log(localStorage.user);
if (localStorage.user != "") {
    document.location.href = './home.html';
}
else {
    document.querySelector("header").classList.remove("hide");
    document.querySelector("#loginbox").classList.remove("hide");
}



//bind buttons and allow for login
document.querySelector(".return_button").onclick = () => {
    document.location.href = './index.html';
};


const login_btn = document.querySelector("#login");
login_btn.onclick = () => {
    loginCheck();
}

const loginCheck = async () => {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    
    
    const response = await fetch(
        "./backend/login.php",
        {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,   
            })
        }
    );

    resp_data = await response.json();
    //console.log(resp_data);
    if (resp_data == false || resp_data['password'] != password) {
        alert("Invalid credentials. Please retype your username and/or password.");
    }
    else {
        //console.log("You're logged in! Hooray!");
        let user = {};
        user['username'] = resp_data['user'];
        user['isAdmin'] = resp_data['is_admin'];
        localStorage.user = JSON.stringify(user);
        document.location.href = './home.html';
    }
}



