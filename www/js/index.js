"use strict";
if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}



let pages = [];
let links = [];

function onDeviceReady() {
    serverData.getJSON();

    pages = document.querySelectorAll('[data-role="page"]');

    links = document.querySelectorAll('[data-role="nav"] a');

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", navigate);
    };

    document.getElementById("refreshButton").addEventListener("click", function() {
        let myTable = document.querySelector("#teamStandings");
        let rowCount = myTable.rows.length;

        for (let i = 1; i < rowCount; i++) {

            myTable.deleteRow(1);
        }
        serverData.getJSON();
    });

}

function navigate(ev) {
    ev.preventDefault();

    let link = ev.currentTarget;

    let id = link.href.split("#")[1];
    history.replaceState({}, "", link.href);

    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id == id) {
            pages[i].classList.add("active");
        } else {
            pages[i].classList.remove("active");
        }
    }
}

let serverData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/quidditch.php",
    httpRequest: "GET",
    getJSON: function() {
        let headers = new Headers();
        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");
        console.dir("headers: " + headers.get("Content-Type"));
        console.dir("headers: " + headers.get("Accept"));
        let options = {
            method: serverData.httpRequest,
            mode: "cors",
            headers: headers
        };
        let request = new Request(serverData.url, options);
        console.log(request);

        fetch(request)
            .then(function(response) {

                console.log(response);
                return response.json();
            })
            .then(function(data) {
                console.log(data); // now we have JS data, let's display it

                // Call a function that uses the data we recieved  
                displayData(data);
            })
            .catch(function(err) {
                alert("Error: " + err.message);
            });
    }
};

function displayData(data) {
    localStorage.setItem("scores", JSON.stringify(data));

    console.log(data.teams);
    console.log(data.scores);


    let resultDiv = document.querySelector(".results_list");
    resultDiv.innerHTML = "";

    data.scores.forEach(function(value) {

        let div = document.createElement("div");
        div.className = "date";
        resultDiv.appendChild(div);

        let h3 = document.createElement("h3");
        h3.textContent = value.date;
        div.appendChild(h3);

        let games = value.games;

        games.forEach(function(value) {

            let div = document.createElement("div");
            div.className = "scoreDiv";

            let homeScore = value.home_score;

            let awayScore = value.away_score;


            let homeTeam = getTeamName(data.teams, value.home);
            let awayTeam = getTeamName(data.teams, value.away);

            let hPng;
            let homeTeamLogo = homeTeam;
            if (homeTeamLogo === "Gryffindor") {
                hPng = '<img src="img/gryffindor.png"/>';
            } else if (homeTeamLogo === "Ravenclaw") {
                hPng = '<img src="img/ravenclaw.png"/>';
            } else if (homeTeamLogo === "Hufflepuff") {
                hPng = '<img src="img/hufflepuff.png"/>';
            } else if (homeTeamLogo === "Slytherin") {
                hPng = '<img src="img/slytherin.png"/>';
            } else {
                hPng = '<img src="img/logo.png"/>';
            }

            let aPng;
            let awayTeamLogo = awayTeam;
            if (awayTeamLogo === "Gryffindor") {
                aPng = '<img src="img/gryffindor.png"/>';
            } else if (awayTeamLogo === "Ravenclaw") {
                aPng = '<img src="img/ravenclaw.png"/>';
            } else if (awayTeamLogo === "Hufflepuff") {
                aPng = '<img src="img/hufflepuff.png"/>';
            } else if (awayTeamLogo === "Slytherin") {
                aPng = '<img src="img/slytherin.png"/>';
            } else {
                aPng = '<img src="img/logo.png"/>';
            }

            let hometeamdiv = document.createElement("div");
            hometeamdiv.className = "homeTeam";
            hometeamdiv.innerHTML = homeTeam + "&nbsp";
            div.appendChild(hometeamdiv);

            let hometeamscorediv = document.createElement("div");
            hometeamscorediv.className = "homeTeamScore";
            hometeamscorediv.innerHTML = "<b>" + homeScore + "</b>" + "&nbsp" + "<br>";
            div.appendChild(hometeamscorediv);

            let awayteamscorediv = document.createElement("div");
            awayteamscorediv.className = "awayTeamScore";
            awayteamscorediv.innerHTML = "<b>" + awayScore + "</b>" + "&nbsp" + "<br>";
            div.appendChild(awayteamscorediv);

            let awayteamdiv = document.createElement("div");
            awayteamdiv.className = "awayTeam";
            awayteamdiv.innerHTML = awayTeam + "&nbsp";
            div.appendChild(awayteamdiv);

            let homeLogoDiv = document.createElement("div")
            homeLogoDiv.id = "homeTeamLogo";
            homeLogoDiv.innerHTML = hPng;
            div.appendChild(homeLogoDiv);

            let awayLogoDiv = document.createElement("div")
            awayLogoDiv.id = "awayTeamLogo";
            awayLogoDiv.innerHTML = aPng;
            div.appendChild(awayLogoDiv);

            resultDiv.appendChild(div);

        })

    })


    let scores = data.scores;
    let teams = data.teams;
    let team_list = [];

    teams.forEach(function(value) {

        var team = {
            teamID: value.id,
            teamName: getTeamName(data.teams, value.id),
            win: 0,
            loss: 0,
            tie: 0,
            pts: 0
        };

        team_list.push(team);
    })

    console.log(team_list);

    console.log("\n\nScores Page\n\n");

    scores.forEach(function(value) {

        console.log(value.date);
        let games = value.games;

        games.forEach(function(value_games) {


            let homeScore = value_games.home_score;
            let awayScore = value_games.away_score;

            let homeTeam = getTeamName(data.teams, value_games.home);
            let awayTeam = getTeamName(data.teams, value_games.away);


            if (homeScore > awayScore) {
                for (var i = 0; i < team_list.length; i++) {
                    if (value_games.home == team_list[i].teamID) {
                        team_list[i].win++;
                        team_list[i].pts = team_list[i].pts + 3;
                    }
                }
                for (var i = 0; i < team_list.length; i++) {
                    if (value_games.away == team_list[i].teamID) {
                        team_list[i].loss++;
                        team_list[i].pts = team_list[i].pts + 0;
                    }
                }
            }

            if (homeScore < awayScore) {
                for (var i = 0; i < team_list.length; i++) {
                    if (value_games.home == team_list[i].teamID) {
                        team_list[i].loss++;
                        team_list[i].pts = team_list[i].pts + 0;
                    }
                }
                for (var i = 0; i < team_list.length; i++) {
                    if (value_games.away == team_list[i].teamID) {
                        team_list[i].win++;
                        team_list[i].pts = team_list[i].pts + 3;
                    }
                }
            }

            if (homeScore == awayScore) {
                for (var i = 0; i < team_list.length; i++) {
                    if (value_games.home == team_list[i].teamID) {
                        team_list[i].tie++;
                        team_list[i].pts = team_list[i].pts + 1;
                    }
                }
                for (var i = 0; i < team_list.length; i++) {
                    if (value_games.away == team_list[i].teamID) {
                        team_list[i].tie++;
                        team_list[i].pts = team_list[i].pts + 1;
                    }
                }
            }

            console.log(awayTeam + " " + awayScore + " - " + homeScore + " " + homeTeam);

        })



    })
    team_list.forEach(function(value) {

        let tbody = document.querySelector("#teamStandings tbody");
        var teamLogo;
        var TeamLogo = value.teamName;
        if (TeamLogo === "Gryffindor") {
            teamLogo = '<img src = "img/gryffindor.png">';
        } else if (TeamLogo === "Ravenclaw") {
            teamLogo = '<img src = "img/ravenclaw.png">';
        } else if (TeamLogo === "Hufflepuff") {
            teamLogo = '<img src = "img/hufflepuff.png">';
        } else if (TeamLogo === "Slytherin") {
            teamLogo = '<img src = "img/slytherin.png">';
        } else {
            teamLogo = '<img src="img/logo.png"/>';
        }

        let wins = value.win;
        let losses = value.loss;
        let ties = value.tie;
        let points = value.pts;
        let name = value.teamName;
        let gp = value.win + value.loss + value.tie;

        let tr = document.createElement("tr");
        let tlogo = document.createElement("td");
        tlogo.innerHTML = teamLogo;
        let tdn = document.createElement("td");
        tdn.textContent = name;
        let tgp = document.createElement("td");
        tgp.textContent = gp;
        let tdw = document.createElement("td");
        tdw.textContent = wins;
        let tdl = document.createElement("td");
        tdl.textContent = losses;
        let tdt = document.createElement("td");
        tdt.textContent = ties;
        let tdp = document.createElement("td");
        tdp.textContent = points;
        tr.appendChild(tlogo);
        tr.appendChild(tdn);
        tr.appendChild(tgp);
        tr.appendChild(tdw);
        tr.appendChild(tdl);
        tr.appendChild(tdt);
        tr.appendChild(tdp);
        tbody.appendChild(tr);
    })

}

function getTeamName(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return teams[i].name;
        }
    }
    return "null";
}