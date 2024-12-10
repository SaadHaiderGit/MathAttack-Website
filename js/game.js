//PURPOSE: Used for all game pages
import { check_date, extract_questions } from "./daily.js";
import { generateEquation } from "./equation_gen.js";

//Check if logged in
if (localStorage.user == "") {
    console.log("AA")
    document.location.href = '../login.html';
}
else {
    document.querySelector("#container").classList.remove("hide");   
}



//async leaderboard functions for retrieving user's ranking, and saving/updating a new record
const leaderboard_check = async (flag='none') => {
    if (flag == 'daily_check' && game_type == "daily") {        //for daily challenge, check date (update challenge if needed)
        await check_date(".");
        daily_bank = await extract_questions();
        console.log(daily_bank);
    }
    const response = await fetch(
        "../backend/game.php",
        {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "check",
                table_name: table_name, 
                user: user,    
            })
        }
    );

    user_leaderboard_info = await response.json();
    if (!user_leaderboard_info) {
        user_leaderboard_info = "empty";
    }
    console.log(user_leaderboard_info);
    if (flag == 'daily_check' && game_type == "daily") {                //for daily challenge, configure text and game access
        const start_text = document.querySelector("#starting-text");
        if (user_leaderboard_info != "empty") {
            start_text.textContent = 
            `Sorry, you already played the daily challenge today! Come back tomorrow for another challenge.`;
        }
        else {
            start_text.innerHTML =
            `Welcome to the game! This mode is different, in that you will have 5 tough questions to solve, and no time limit.
                You advance to the next question upon entering an answer, so be careful not to answer incorrectly! You'll
                still want to go as fast as you can, to get the best place on the leaderboard. You only have one try per day, so
                make it count!
                <br>
                <br>
                It is expected that you will not use calculators when playing. Please refrain from using them,
                as they take away from the experience of the game. You may use paper if it helps you for this challenge.
                <br>
                <br>
                When you are ready, click "Start Game" to begin. If you wish to play a different mode, click "Go Back".`
            document.querySelector("#startgame_button").classList.remove("hide");
        }
    }
}

const leaderboard_save = async () => {
    const response = await fetch(
        "../backend/game.php",
        {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "save",
                table_name: table_name, 
                user: user,
                score: score,
                time: total_time    
            })
        }
    );

    let resp_data = await response.json();
    console.log(resp_data);
}

const leaderboard_update = async () => {
    const response = await fetch(
        "../backend/game.php",
        {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                table_name: table_name, 
                user: user,
                score: score,
                time: total_time    
            })
        }
    );

    let resp_data = await response.json();
    console.log(resp_data);
}



//Detect gamemode, initialize default values, and retrieve user's leaderboard ranking (if it exists)
let curr_location = document.querySelector("#game-id").textContent.split(" ");

let answer = "";
let gamemode = curr_location[0].toLowerCase();
let game_type = curr_location[3].toLowerCase();

if (game_type == "standard") {
    game_type = 'challenge';        //refer to standard challenge as simply 'challenge'
}

console.log(gamemode);
console.log(game_type);

let daily_bank = "";
let question = 1;
const str_question_num = document.querySelector("#curr_question");
const str_total_time = document.querySelector("#time-total");

const user = JSON.parse(localStorage.user)["username"];
const table_name = `leaderboard_${game_type}`;
let user_leaderboard_info = "";
if (gamemode != "casual") {
    leaderboard_check("daily_check");
}

const str_equation = document.querySelector("#equation");
const str_score = document.querySelector("#score");
const str_time_left = document.querySelector("#time-left");
const str_correct = document.querySelector("#correct-text");
const str_invalid = document.querySelector("#invalid-text");
const str_incorrect = document.querySelector("#incorrect-text");
const str_warning = document.querySelector("#warning-text");
const str_evaluation = document.querySelector("#evaluation-text");

let score = 0;
let time_left = 30;
let time_left_cap = 30;

let min_time_increase = 10;
let time_increase = 15;
let max_time_decrease = 5;
let time_decrease = 5;

let game_active = false;
let total_time = 0;  
let total_time_seconds = 0;
let total_time_minutes = 0;

let text_fadeout_wait = 1000;



//bind buttons
const startgame_button = document.querySelector("#startgame_button");
const submit_button = document.querySelector("#submit_button");
const replaygame_button = document.querySelector("#replaygame_button");
const return_buttons = document.querySelectorAll(".return_button");

startgame_button.addEventListener("click", evt => {
    startgame();
    evt.preventDefault();
}); 

if (game_type != "daily") {
    replaygame_button.addEventListener("click", evt => {
        startgame();
        evt.preventDefault();
    }); 
}

submit_button.addEventListener("click", evt => {
    if (game_type != "daily") {
        submit_check();
    }
    else {
        submit_daily_check();
    }
    evt.preventDefault();
}); 

for (let return_button of return_buttons) {
    return_button.addEventListener("click", evt => {
        document.location.href = '../home.html';
        evt.preventDefault();
    }); 

} 



//start game
const startgame = () => {
    game_active = true;
    score = 0;
    time_left = 30;
    total_time = 0;
    total_time_seconds = 0;
    total_time_minutes = 0;

    if (gamemode != "casual") { 
        leaderboard_check(); 
    }
    
    if (game_type == "daily") {
        time_left = Infinity;
        time_left_cap = Infinity;
        str_question_num.textContent = `QUESTION: ${question}`;
        str_total_time.textContent = `TIME SPENT: ${total_time_minutes}:${total_time_seconds.toString().padStart(2, '0')}`;
    }
    else {
        next_equation();
        for (let i = 0; i < 100; i++) {
            next_equation();
        }
        str_score.textContent = `SCORE: ${score}`;
        str_time_left.textContent = `TIME LEFT: ${time_left}`;
    }
    

    document.querySelector("#starting-menu").classList.add("hide");
    document.querySelector("#end-menu").classList.add("hide");
    document.querySelector("#main-content").classList.remove("hide");
    
    time_log();

    if (game_type == "daily") {
        next_daily_equation();
    }
}



//set time interval for counting down time, and to track total time
const time_log = () => {
    let clock = null;
    clock = setInterval(() => {
        if (game_active && time_left > 0) {
            total_time_seconds++;
            if (total_time_seconds == 60) {
                total_time_seconds = 0;
                total_time_minutes++;
            }
            
            time_left--;
            str_time_left.textContent = `TIME LEFT: ${time_left}`;
            str_total_time.textContent = `TIME SPENT: ${total_time_minutes}:${total_time_seconds.toString().padStart(2, '0')}`;
            //console.log("UPUPUPUPUP")
        }
        else {
            game_stop();
            //console.log("Game stopped! Total time ==> ", total_time);
            clearInterval(clock);
        }
    }, 1000);
} 



//generate the next equation
const next_equation = () => {

    let equation = generateEquation(gamemode, game_type);
    answer = eval(equation);
    console.log(equation + "  ==>  " + answer);
    //console.log(str_equation)
    str_equation.textContent = equation;
}



//display the next daily challenge equation
const next_daily_equation = () => {
    if (question >= 6) {
        game_stop();
    }
    else {
        let equation = daily_bank[question-1]["question"];
        answer = eval(equation);
        console.log(equation + "  ==>  " + answer);
        //console.log(str_equation)
        str_equation.textContent = equation;
    }
    
}


//upon submitting an answer, check if correct; move on if so, else reduce time left
const submit_check = () => {
    let input = document.querySelector("#answer-input").value;
    if (input.trim() == answer) {
        //add time and score, reset old timer (do that in main loop?), tell user they got it right! generate next equation 
        score++;
        time_left = Math.min(time_left_cap, (time_left + time_increase));
        next_equation();
        str_score.textContent = `SCORE: ${score}`;
        str_time_left.textContent = `TIME LEFT: ${time_left}`;

        str_correct.classList.remove('hide');
        str_invalid.classList.add('hide');
        str_incorrect.classList.add('hide');
    }

    else if (isNaN(input) || input.trim() == "") {
        //inform user to use a valid number input
        str_correct.classList.add('hide');
        str_invalid.classList.remove('hide');
        str_incorrect.classList.add('hide');
    }

    else {
        //penalize time for bad answer; end the game if no time left
        time_left -= time_decrease;
        str_time_left.textContent = `TIME LEFT: ${time_left}`;
        if (time_left < 0) {
            game_stop();
        }
        else {
            str_correct.classList.add('hide');
            str_invalid.classList.add('hide');
            str_incorrect.classList.remove('hide');
        }
    }
}



//upon submitting an answer for the daily challenge, check if correct, and move on to the next question
const submit_daily_check = () => {
    let input = document.querySelector("#answer-input").value;
    if (input.trim() == answer) {
        score++;
        str_score.textContent = `SCORE: ${score}`;
    }
    question++;
    str_question_num.textContent = `QUESTION: ${question}`;
    next_daily_equation();
}



//handle end of game
const game_stop = () => {
    if (game_active) {
        game_active = false;
        let max_score = "";
        if (game_type == "daily") {
            max_score = "/5";
        }

        total_time_minutes = total_time_minutes.toString();
        total_time_seconds = total_time_seconds.toString().padStart(2, '0');
        total_time = `${total_time_minutes}:${total_time_seconds}`;
        document.querySelector("#evaluation-results").innerHTML =  
            `Final Score - <u>${score}${max_score}</u>
            <br>
            Total Time - <u>${total_time}</u>`;

        if (user_leaderboard_info == "empty") {
            leaderboard_save();
            leaderboard_check();
            if (game_type == "daily") {
                str_evaluation.textContent = "Well done on your attempt. The leaderboard for today has been updated."
            }
            else {
                str_evaluation.textContent = "You're made your first ever record for this gamemode, congratulations! " +
                 "The leaderboard has been updated."
            }
            
        }
        else if (gamemode != "casual") {
            if (score > user_leaderboard_info['score'] || 
                (score == user_leaderboard_info['score'] && total_time < user_leaderboard_info['time'])) {
                    leaderboard_update();
                    leaderboard_check();
                    str_evaluation.textContent = 
                        "You broke your previous record for this gamemode, congratulations! The leaderboard has been updated.";
            }
            else {
                str_evaluation.textContent = "No new record was made in this attempt."
            }
        }
        else {
            str_evaluation.textContent = "This gamemode has no leaderboard, so your attempt will not be recorded."
        }

        str_correct.classList.add('hide');
        str_invalid.classList.add('hide');
        str_incorrect.classList.add('hide');
        document.querySelector("#main-content").classList.add("hide");
        document.querySelector("#end-menu").classList.remove("hide");
    }
}


