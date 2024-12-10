//PURPOSE: imported functions related to handling the daily challenge 
import { generateEquation } from "./equation_gen.js";

//empty the previous day's leaderboard and start anew for today's daily challenge
const refresh_daily_leaderboard = async (location="") => {
    const response = await fetch(
        `${location}./backend/daily.php`,
        {
            method: 'DELETE',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            })
        }
    );

    let resp_data = await response.json();
    console.log(resp_data);
}


//update the five questions used for today's daily challenge
const update_daily_questions = async (id, question, location="") => {
    const response = await fetch(
        `${location}./backend/daily.php`,
        {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "daily_bank",
                id: id,
                question: question,
            })
        }
    );

    let resp_data = await response.json();
    console.log(resp_data);
}


//update the date
const update_date = async (date, location="") => {
    const response = await fetch(
        `${location}./backend/daily.php`,
        {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "server_date",
                date: date,
            })
        }
    );

    let resp_data = await response.json();
    console.log(resp_data);
}



//Check the date and compare it; on a new day, change the challenge and refresh the leaderboard
const check_date = async (location="") => {
    let date = new Date;
    console.log(date.toUTCString());
    let curr_date = date.toUTCString().split(" ").splice(1,3).join(" ");

    const response = await fetch(
        `${location}./backend/daily.php`,       //extra dot, if accessed from challenge_daily.html
        {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "date_check",
            })
        }
    );

    let old_date = await response.json();


    console.log(old_date['date']);
    console.log(curr_date);
    console.log(old_date['date'] == curr_date);
    //console.log(generateEquation("challenge", "daily"));

    if (old_date['date'] != curr_date) {
        await refresh_daily_leaderboard(location);
        for (let i = 0; i < 5; i++) {
            let new_question = generateEquation("challenge", "daily");
            console.log(new_question);
            await update_daily_questions(i+1, new_question, location);
        }
        update_date(curr_date, location);
    }
}



//Pull out daily questions for the Daily Challenge
const extract_questions = async () => {
    const response = await fetch(
        `../backend/daily.php`,          //is always accessed from challenge_daily.html
        {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "extract_questions",
            })
        }
    );

    let daily_bank = await response.json();
    return daily_bank;
}

export {check_date, extract_questions};