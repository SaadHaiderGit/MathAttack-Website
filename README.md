# MathAttack Website

MathAttack is a game website where users can compete against each other in solving math equations as fast as possible. It is a fully built and working site with a leaderboard system, a login feature, and various game modes to play from, including a Daily Challenge that resets every day.

This website was hosted on AWS for some time. Unfortunately the AWS site is down due to running costs being too high, but you can clone this project so that it runs on your local machine.

## Setup

This website can be run using XAMPP's Apache server, which allows for PHP and mySQL/MariaDB use. You can download XAMPP at https://www.apachefriends.org/. Make sure to have Apache, MySQL, PHP, and phpMyAdmin checked when running the installation wizard.

When you want to run a server using XAMPP, simply open up the XAMPP control panel, then click the "Start" action for both Apache and mySQL.

![image](https://github.com/SaadHaiderGit/ReactDonutShop/assets/118562950/67f6a11f-82df-41e3-a466-6bb0567af056)

Your server will run on your specified port. For accessing the website, you can either use localhost or 127.0.0.1 for the beginnning of your address (I will use the latter for demonstration purposes). 

![image](https://github.com/SaadHaiderGit/ReactDonutShop/assets/118562950/46a93920-3e1b-461a-a8e4-a0e9a9d5db3f)

Download the Github repository and save it in xampp\htdocs\Projects. Then access phpMyAdmin through your port (e.g.: 127.0.0.1/phpmyadmin/). In phpMyAdmin, you will need to import the mathattack.sql file in order to make full use of the MathAttack website; you can do this by clicking on "Import" at the top navigation menu, then choosing the sql file to import. After that, click on the Import button at the bottom of the menu, and your SQL database should be good to go.  

## Usage

To access the actual website, start running your XAMPP server, then access the index.html file. I use the following link: http://localhost:8080/projects/MathAttack-Website/index.html

I have yet to implement a registration feature for the website, but you can use the following username & password combinations to login to the website:

1) googeyser --> 12access34

2) saarah12 --> letmein

3) sahaider --> secretpa55word

The last user is an admin user, who can access an admin panel for configuring leaderboards.



