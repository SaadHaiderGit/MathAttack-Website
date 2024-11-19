//we could make this an imported function, you know. Export it! Try it! 

//Initialize global values and username info
let curr_table = "Daily Challenge";
let user_info = localStorage.user ?? "";
if (user_info == "") {
    //console.log("this person should NOT be here! he/she is not logged in!");
    document.location.href = './login.html';
}
else {
    user_info = JSON.parse(user_info);
    //console.log(user_info);
    document.querySelector(".nav_menu").classList.remove("hide");
    document.querySelector("#homepage").classList.remove("hide");
}



//link navbar information
const admin_access = document.querySelector(".admin_access");
document.querySelector(".lastitem").textContent = `Logged in as: ${user_info['username']}`;

if (user_info['isAdmin'] == 1) {
    admin_access.classList.remove("hide");
    admin_access.addEventListener("click", evt => {
        alert("Page is a work in progress.")
        //document.location.href = './login.html';
        evt.preventDefault();
    });
}

document.querySelector(".logout").addEventListener("click", evt => {
    localStorage.user = "";
    document.location.href = './login.html';
    evt.preventDefault();
});



//handle page switching
const pages = document.querySelectorAll(".page");
const page_switch = (page) => {
    for (p of pages) {
        p.classList.add("hide");
    }
    page.classList.remove("hide");
    
}

document.querySelector(".leaderboard_button").addEventListener("click", evt => {
    page_switch(document.querySelector("#leaderboard"));
    show_table(curr_table);
    evt.preventDefault();
});

for (return_button of document.querySelectorAll(".return_button")) {
    return_button.addEventListener("click", evt => {
        page_switch(document.querySelector("#homepage"));
        evt.preventDefault();
    });
}

for (navigate_button of document.querySelectorAll(".navigate_button")) {
    navigate_button.addEventListener("click", evt => {
        page_type = evt.currentTarget.closest(".main-box");
        if (page_type.classList.contains("left-side")) {
            page_switch(document.querySelector("#casual_page"));
        }
        else if (page_type.classList.contains("center-side")) {
            page_switch(document.querySelector("#ranked_page"));
        }
        else if (page_type.classList.contains("right-side")) {
            page_switch(document.querySelector("#challenge_page"));
        }
        else {
            alert("You accessed a page that doesn't exist. If you see this alert, please contact the admins, thank you.");
        }
        evt.preventDefault();
    });
}

for (game_enter_button of document.querySelectorAll(".game_enter_button")) {
    game_enter_button.addEventListener("click", evt => {
        alert("Gamemodes are a work in progress.")
        //will use evt.currentTarget here to get value, send it to next page
    });
}



//display the correct leaderboard table 
const show_table = async (table_value) => {
    let table_name = "leaderboard_";
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
                table_name: table_name,     
            })
        }
    );

    resp_data = await response.json();
    //console.log(resp_data);

    //table_display
    if (resp_data.length != 0 && resp_data != false) {
        table_html = `<table class="table center">
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Time</th>
                        </tr>`;
                        
        for (i in resp_data) {
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
        table_display.innerHTML = "<p class='no-table'><i>This leaderboard is empty. Be the first to claim a spot!</i></p>";
    }
}

const tables = document.querySelectorAll(".select_table");
for (table of tables) {
    table.addEventListener("click", evt => {
        document.querySelector(".active_table").classList.remove("active_table");
        evt.currentTarget.classList.add("active_table");
        show_table(evt.currentTarget.value);

        evt.preventDefault();
    });
}

