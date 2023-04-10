const navbar = document.getElementById('main-nav');
const toggle = document.getElementById('navbar-toggle');

toggle.addEventListener('click', () => {
    // Toggle display of nav bar on narrow screens, and toggle icon between bars and X
    // Uses FontAwesome icon classes; fa-bars displays the Fontawesome bars icon, fa-x displays the Fontawesome X icon
    toggle.classList.toggle('fa-bars');
    toggle.classList.toggle('fa-x');
    if (toggle.classList.contains('fa-x')) {
        for (const child of navbar.children) {
            child.style.cssText = 'display: flex';
        }
    }
    else {
        for (const child of navbar.children) {
            child.style.cssText = '';
        }
    }
})

if (document.getElementsByClassName('flashes').length) {
    let flash = document.getElementsByClassName('flashes')[0]
    document.getElementsByTagName('main')[0].style.cssText = 'padding-top: 2em';
    // Button to close flash message
    document.getElementById('flash-close').addEventListener('click', () => flash.style.cssText = 'display: none;')
    // Code to wait for 5 seconds then hide flash message
    // Modified from 'How To Wait One Second' by Mastering JS
    // Accessed 21 Jan 2023
    // Available from:
    // https://masteringjs.io/tutorials/fundamentals/wait-1-second-then.
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }
      
      delay(5000).then(() => flash.style.cssText = 'display: none;');
    // End referenced code
}

let commentDeleteBtns = document.querySelectorAll('.delete-comment');
commentDeleteBtns.forEach((button) => {
    button.addEventListener('click', () => {
        if (confirm('Would you like to delete this comment?')) {
            comment_id = button.classList[3];
            let xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", `/comment/${comment_id}`);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.addEventListener('load', function() {
                console.log(this.response);
            })
            xhttp.send(JSON.stringify({comment_id: comment_id}))
            button.parentElement.parentElement.style.cssText = 'display: none;';    
        }
    })
})

let commentFlagBtns = document.querySelectorAll('.flag-comment');
commentFlagBtns.forEach((button) => {
    button.addEventListener('click', () => {
        if (confirm('Would you like to report this comment?')) {
            comment_id = button.classList[4];
            user_id = button.classList[3];
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", `/report-comment/${comment_id}/${user_id}`);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.addEventListener('load', function() {
                console.log(this.response);
            })
            xhttp.send(JSON.stringify({user_id: comment_id}))
            alert('Thank you, we will review this comment as soon as we can.');
        }
    })
})