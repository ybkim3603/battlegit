userList = [];

// Get the GitHub username input form
const gitHubForm = document.getElementById('gitHubForm');

// Listen for submissions on GitHub username input form
gitHubForm.addEventListener('submit', (e) => {

    // Prevent default form submission action
    e.preventDefault();

    // // Get the GitHub username input field on the DOM
    let usernameInput = document.getElementById('player_name');

    // // Get the value of the GitHub username input field
    let gitHubUsername = usernameInput.value;

    addUserList(gitHubUsername);

    usernameInput.value = "";
    // // Run GitHub API function, passing in the GitHub username
    // requestUserRepos(gitHubUsername);
    // requestUserRepos(gitHubUsername2);

})

function addUserList(username){

    const xhr = new XMLHttpRequest();
    const url = `https://api.github.com/users/${username}`;
    console.log("UNSENT", xhr.readyState);

    xhr.open('GET', url, true);
    console.log("OPENED", xhr.readyState);

    xhr.onload = function() {
        const data = JSON.parse(this.response);
        let ul = document.getElementById('userList');
        
        // user not exist
        if(data.message === "Not Found"){
            let li = document.createElement('li');
            li.classList.add('list-group-item')
            li.innerHTML = (`
                <p><strong>No account exists with username:</strong> ${username}</p>`);
            ul.appendChild(li);
            setTimeout(function(){
                ul.removeChild(li);
            }, 1500);
        } else if (userList.findIndex(i => i.name === `${username}`) > -1) {
            let li = document.createElement('li');
            li.classList.add('list-group-item')
            li.innerHTML = (`
                <p><strong>User</strong> ${username} <strong>already exist!</strong></p>`);
            ul.appendChild(li);
            setTimeout(function(){
                ul.removeChild(li);
            }, 1500);
        } else { // user exist
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = (`${username}`);
            ul.appendChild(li);

            let userObj = {};
            userObj.name = username;
            userList.push(userObj);
        }
    }
    xhr.send();
}

const battle = document.getElementById('battle');

battle.addEventListener('click', startbattle);

function startbattle(){
    
    for (let i = 0; i<userList.length; i++){
        let username = userList[i].name;
        console.log('username: ', username);
        
        const xhr = new XMLHttpRequest();
        const url = `https://api.github.com/users/${username}/repos`;
        console.log("UNSENT", xhr.readyState);
        
        xhr.open('GET', url, true);
        console.log("OPENED", xhr.readyState);

        let stargazers_count = 0;
        let watchers_count = 0;
        let forks_count = 0;
        
        xhr.onload = function() {
            const data = JSON.parse(this.response);
            
            for(let j in data){
                stargazers_count += data[j].stargazers_count;
                watchers_count += data[j].watchers_count;
                forks_count += data[j].forks_count;
            }

            userList[i].stargazers_count = stargazers_count;
            userList[i].watchers_count = watchers_count;
            userList[i].forks_count = forks_count;
            
            score = (stargazers_count*0.5) + (watchers_count*0.3) + (forks_count*0.2);
            userList[i].score = score;

            let ul = document.getElementById('repoinfo');
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = (`
                <p><strong>username:</strong> ${userList[i].name}</p>
                <p><strong>Total stargazers_count:</strong> ${userList[i].stargazers_count}</p>
                <p><strong>Total watchers_count:</strong> ${userList[i].watchers_count}</p>
                <p><strong>Total forks_count:</strong> ${userList[i].forks_count}</p>
                <p><strong>Score:</strong> ${userList[i].score}</p>
            `);
            ul.appendChild(li);
        }
        xhr.send();
    }
    userList.forEach((user) => console.log("NAME: " , user.name));
    printWinner();
}

function printWinner(){

    userList.forEach((user) => console.log(user.score));

    let winner_idx = 0;
    let len = userList.length;
    let draw = new Array(len);

    let max_score = userList[0].score;
    console.log(typeof userList[0].score);

    for(let i = 1;i<userList.length;i++){
        if(userList[i].score > max_score){
            winner_idx = i;
            max_score = userList[i].score;
        }else if(userList[i].score === max_score){
            draw[i] = true;
        }
        else continue;
    }
    console.log('winner: ', userList[winner_idx].name);
    console.log('winner score: ', max_score);
    
    let result_ul = document.getElementById('result_ul');
    let result_li = document.createElement('li');
    result_li.classList.add('list-group-item');

    result_li.innerHTML = (`
        <h5><strong>Winner</strong></h5>
        <p><strong>username:</strong> ${userList[winner_idx].name}</p>
    `)

    result_ul.appendChild(result_li);
}