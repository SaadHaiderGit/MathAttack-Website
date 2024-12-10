"use strict";
const getElement = selector => document.querySelector(selector);

// image constants 
const backImgSrc = "images/back.png";
const blankImgSrc = "images/blank.png";
const cardImgSrcStart = "images/card_";

document.addEventListener("DOMContentLoaded", () => {
    
    // display cards and player info
    const player_name = localStorage.player_name ?? "";
    const num_cards = localStorage.num_cards ?? "48";
    let high_scores = localStorage.high_scores ?? {}; 
    if (typeof(high_scores) == "string") {
        high_scores = JSON.parse(high_scores);
    }

    if (player_name) {
        document.querySelector("#player").textContent = `Player: ${player_name}`;
    }
    if (high_scores[player_name] !== undefined) {
        document.querySelector("#high_score").textContent = `High Score: ${Math.round(high_scores[player_name] * 100)}%`;
    }

    const cards = document.querySelector("#cards");
    let img_array = [];

    const cards_inner_html = () => {
        let inner_html = "";

        const back_image = new Image();
        back_image.src = "images/back.png";
        const blank_image = new Image();
        blank_image.src = "images/blank.png";

        for (let i = 0; i < parseInt(num_cards)/2; i++) {       //preload images and an array for random generation
            const card_image = new Image();
            card_image.src = `images/card_${i+1}.png`; 
            img_array.push(`A_images/card_${i+1}.png`, `B_images/card_${i+1}.png`); 
        }

        for (let i = 0; i < parseInt(num_cards)/8; i++) {       //randomly generate each row of cards
            let row_html = "";
            for (let j = 0; j < 8; j++) {
                const index = Math.floor(Math.random() * img_array.length);
                row_html += `<a href="#" id="${img_array[index]}"><img src="images/back.png" alt=""></img></a>`
                img_array[index] = img_array[img_array.length - 1];
                img_array.pop();
            }
            inner_html += `<div>${row_html}</div>`;
        }
        cards.innerHTML = inner_html;
    }

    cards_inner_html();



    // load settings data
    document.querySelector("#player_name").value = player_name;
    document.querySelector("#num_cards").value = num_cards;



	// add click event handler for each card link
    let no_loading_images = true;
    let faceup_cards = 0;
    let attempts = 0
    let pairs_left = num_cards;                   
    let card_1 = "";
    let card_1_img = "";
    let card_2 = "";
    let card_2_img = "";

    const image_Swap = (link) => {                                      //when image clicked, flip it
        const image = link.querySelector("img");
        if (no_loading_images && (image.src.includes("images/back.png"))) {
            no_loading_images = false;
            image.style.opacity = 1;
            image_fade(image, link);

            if (faceup_cards++ == 0) {
                card_1 = link;
                card_1_img = image;
            }
            else {
                card_2 = link;
                card_2_img = image;
                image_match(card_1_img, card_1, card_2_img, card_2)
            }
        }
    }

    const image_match = (card_1_img, card_1, card_2_img, card_2) => {   //when two images flipped, check for a match
        
        let timer = null;
        timer = setTimeout(() => {
            if (card_1.id.slice(2) == card_2.id.slice(2)) {
                image_fade(card_1_img, card_1, "correct");
                image_fade(card_2_img, card_2, "correct");
                pairs_left = pairs_left - 2;
            }
            else {
                image_fade(card_1_img, card_1, "fail");
                image_fade(card_2_img, card_2, "fail");
            }
            no_loading_images = true;
            faceup_cards = 0;
            attempts++;

            if (pairs_left == 0) {                                      //once all cards matched, get & save scores
                let victory_timer = null;
                victory_timer = setTimeout(() => {
                    
                    //console.log(`WINNER! You made ${num_cards/2} matches out of ${attempts} attempts.`);
                    const score = (num_cards/2) / attempts;
                    document.querySelector("#correct").textContent = `Correct: ${Math.round(score * 100)}%`;

                    let new_high_score = document.querySelector("#high_score")
                    if (!new_high_score.textContent.includes("High Score") || high_scores[player_name] < score) {
                        new_high_score.textContent =  `High Score: ${Math.round(score * 100)}%`;
                        if (player_name != "") {
                            high_scores[player_name] = score;
                            localStorage.setItem("high_scores", JSON.stringify(high_scores));
                        }
                    }    
                }, 400)
            }
        }, 1200);
    }

    const image_fade = (image, link, flip_over_type="normal") => {      //fade out images, replace them, then fade in
        let timer = null;
        let toggle_fade = true;
        timer = setInterval(() => {
            
            if (toggle_fade) {
                image.style.opacity = parseFloat(image.style.opacity) - 0.1;

                if (image.style.opacity <= 0.1) {
                    if (faceup_cards == 1) { no_loading_images = true; }

                    if (flip_over_type == "normal") {
                        image.src = link.id.slice(2);
                    }
                    else if (flip_over_type == "fail") {
                        image.src = "images/back.png";
                    }
                    else {
                        image.src = "images/blank.png";
                    }
                    toggle_fade = false;
                }

            } else {
                image.style.opacity = parseFloat(image.style.opacity) + 0.1;
                if (image.style.opacity >= 1) {
                    clearInterval(timer);
                    timer = null;
                }
            }
        }, 25);
    }

    const links = document.querySelectorAll("#cards a");                //add event for all cards to flip when clicked
    for (const link of links) {
        link.addEventListener("click", evt => {
            image_Swap(link);
            evt.preventDefault();
        }); 
    }      



    // add click event handler for each tab link button    
    const tab_cards_link = document.querySelector("#tabs_cards_link");
    const tab_rules_link = document.querySelector("#tabs_rules_link");
    const tab_settings_link = document.querySelector("#tabs_settings_link");
    const tab_cards = document.querySelector("#tabs_cards");
    const tab_rules = document.querySelector("#tabs_rules");
    const tab_settings = document.querySelector("#tabs_settings");
    
    tab_cards_link.addEventListener("click", event => {
        if (!tab_cards_link.classList.contains("active")) {

            tab_cards_link.classList.add("active");
            tab_rules_link.classList.remove("active");
            tab_settings_link.classList.remove("active");

            tab_cards.classList.remove("hide");
            tab_rules.classList.add("hide");
            tab_settings.classList.add("hide");
        }
    }); 

    tab_rules_link.addEventListener("click", event => {
        if (!tab_rules_link.classList.contains("active")) {

            tab_cards_link.classList.remove("active");
            tab_rules_link.classList.add("active");
            tab_settings_link.classList.remove("active");

            tab_cards.classList.add("hide");
            tab_rules.classList.remove("hide");
            tab_settings.classList.add("hide");
        }
    });

    tab_settings_link.addEventListener("click", event => {
         if (!tab_settings_link.classList.contains("active")) {

            tab_cards_link.classList.remove("active");
            tab_rules_link.classList.remove("active");
            tab_settings_link.classList.add("active");

            tab_cards.classList.add("hide");
            tab_rules.classList.add("hide");
            tab_settings.classList.remove("hide");
        }
    });



    // add click event handler for Save Settings button
    document.querySelector("#save_settings").addEventListener("click", event => {
        localStorage.setItem("player_name", document.querySelector("#player_name").value);
        localStorage.setItem("num_cards", document.querySelector("#num_cards option:checked").textContent);
        window.location.reload();
    })
    
}); 