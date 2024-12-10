//PURPOSE: for admin.html

import { check_date } from "./daily.js";

//Initialize global values and username info
let curr_table = "Daily Challenge";
let table_name = "leaderboard_daily";
let user_info = localStorage.user ?? "";
if (user_info == "") {
    //console.log("this person should NOT be here! he/she is not logged in!");
    document.location.href = './login.html';
}
else {
    user_info = JSON.parse(user_info);
    if (user_info["isAdmin"] == 0) {
        document.location.href = './home.html';
    }
    await check_date();
    document.querySelector("#container").classList.remove("hide");
}

const user_input = document.querySelector("#user");
const score_input = document.querySelector("#score");
const time_input = document.querySelector("#time");
const str_notify = document.querySelector("#notify");



//display the correct and most up-to-date leaderboard table 
const show_table = async (table_value) => {
    table_name = "leaderboard_";
        //change later; daily challenge will be checked first to "+= daily", else just append the lowercase table.value
        switch (table_value) {
            case "Addition":
                table_name += "addition";
                break;
            case "Subtraction":
                table_name += "subtraction";
                break;
            case "Multiplication":
                table_name += "multiplication";
                break;
            case "Division":
                table_name += "division";
                break;
            case "Medley":
                table_name += "medley";
                break;
            case "Std. Challenge":
                table_name += "challenge";
                break;
            case "Daily Challenge":
                table_name += "daily";
                break;
        }

    let leaderboard_name = document.querySelector("#l_name");
    console.log(leaderboard_name)
    if (table_value == "Std. Challenge") {
        leaderboard_name.textContent = `Standard Challenge`;
    }
    else {
        leaderboard_name.textContent = `${table_value}`;
        
    }
    console.log(leaderboard_name);
    console.log(table_name);
    curr_table = table_value;
    const table_display = document.querySelector("#leaderboard_table");
    
    //console.log(`\nNew table to find: ${table_name}, w/ ${curr_table} meant to load next time!`);

    const response = await fetch(
        "./backend/home.php",
        {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "display",
                table_name: table_name,     
            })
        }
    );

    let resp_data = await response.json();
    //console.log(resp_data);

    //table_display
    if (resp_data.length != 0 && resp_data != false) {
        let table_html = `<table class="table center">
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Time</th>
                        </tr>`;
                        
        for (let i in resp_data) {
            table_html +=   `<tr>
                            <td>#${parseInt(i)+1}</td>
                            <td>${resp_data[i][0]}</td>
                            <td>${resp_data[i][1]}</td>
                            <td>${resp_data[i][2]}</td>

                            </tr>`
        }
        
        table_display.innerHTML = table_html + "</table>";
    }
    else {
        table_display.innerHTML = "<p class='no-table'><i>This leaderboard is currently empty.</i></p>";
    }
}



//save a new user into a leaderboard
const leaderboard_save = async () => {
    const response = await fetch(
        "./backend/game.php",
        {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "save",
                table_name: table_name, 
                user: user_input.value,
                score: score_input.value,
                time: time_input.value,    
            })
        }
    );

    let resp_data = await response.json();
    console.log(resp_data);
    show_table(document.querySelector(".active_table").value);

    
}



//update a user's placement in a leaderboard
const leaderboard_update = async () => {
    const response = await fetch(
        "./backend/game.php",
        {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                table_name: table_name, 
                user: user_input.value,
                score: score_input.value,
                time: time_input.value,     
            })
        }
    );

    let resp_data = await response.json();
    console.log(resp_data);
    show_table(document.querySelector(".active_table").value);
}



//delete a user from an existing leaderboard
const leaderboard_delete = async () => {
    const response = await fetch(
        "./backend/game.php",
        {
            method: 'DELETE',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                table_name: table_name, 
                user: user_input.value,
            })
        }
    );

    let resp_data = await response.json();
    console.log(resp_data);
    show_table(document.querySelector(".active_table").value);
}



//check if a user is in the leaderboard
const leaderboard_check = async (function_type="none") => {
    const response = await fetch(
        "./backend/game.php",
        {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "check",
                table_name: table_name, 
                user: user_input.value,    
            })
        }
    );

    let user_leaderboard_info = await response.json();
    if (!user_leaderboard_info) {
        user_leaderboard_info = "empty";
    }
    console.log(user_leaderboard_info);


    if (function_type == "save") {
        if (user_leaderboard_info == "empty") {
            leaderboard_save();
            str_notify.innerHTML = `<p>New entry "${user_input.value}" added to the above leaderboard.</p>`;
        }
        else {
            str_notify.innerHTML = `<p>"${user_input.value}" already is in the above leaderboard.</p>`;
        }
    }

    else if (function_type == "update") {
        if (user_leaderboard_info != "empty") {
            leaderboard_update();
            str_notify.innerHTML = `<p>Entry "${user_input.value}" updated in the above leaderboard.</p>`;
        }
        else {
            str_notify.innerHTML = `<p>"${user_input.value}" not found in the above leaderboard.</p>`;
        }
        
    }

    else if (function_type == "delete") {
        if (user_leaderboard_info != "empty") {
            leaderboard_delete();
            str_notify.innerHTML = `<p>Entry "${user_input.value}" deleted from the above leaderboard.</p>`;
        }
        else {
            str_notify.innerHTML = `<p>"${user_input.value}" not found in the above leaderboard.</p>`;
        }
    }
}



//add functionality to choose a table
const tables = document.querySelectorAll(".select_table");
for (let table of tables) {
    table.addEventListener("click", evt => {
        document.querySelector(".active_table").classList.remove("active_table");
        evt.currentTarget.classList.add("active_table");
        show_table(evt.currentTarget.value);

        evt.preventDefault();
    });
}

//bind buttons
document.querySelector(".return_button").addEventListener("click", evt => {
    document.location.href = './home.html';
    evt.preventDefault();
}); 

document.querySelector("#add").addEventListener("click", evt => {
    if (user_input.value != "" && score_input != "" && time_input != "") {
        leaderboard_check("save");
    }
    else {

    }
    
}); 

document.querySelector("#update").addEventListener("click", evt => {
    if (user_input.value != "" && score_input != "" && time_input != "") {
        leaderboard_check("update");
    }
    else {

    }
}); 

document.querySelector("#delete").addEventListener("click", evt => {
    leaderboard_check("delete");
}); 



//initialize table upon entering the website
show_table(curr_table);
