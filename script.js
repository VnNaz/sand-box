'use strict';
function getPosts() {
    return fetch(`http://localhost:3000/posts`)
    .then(response => response.json())
}
function getPostByID(id) {
    return fetch(`http://localhost:3000/posts/${id}`)
    .then(response => response.json())
}
function getUserByID(ID) {
    return fetch(`http://localhost:3000/users/${ID}`)
    .then(response => response.json())
}
function getUsersByName(name) {
    return fetch(`http://localhost:3000/users`)
    .then(response => response.json())
    .then(users => {
        let userList = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
        return userList;
    })
}
function getPostsByUserID(userID) {
    return fetch(`http://localhost:3000/posts/`)
            .then(response => response.json())
            .then(posts => {
                let filledPosts = posts.filter(p => p.userId === userID);
                return filledPosts;
            })
}
function getImgByID(ID) {
    return fetch(`http://localhost:3000/imgs/${ID}`)
    .then(response => response.json())
}
function renderPost(post) {
    const container = document.querySelector('.container');
    container.innerHTML += `
    <div class="post">
    <img src="${post.img}" class="post__img">
    <div class="post__body">
    <h3 class="post__title">
    ${post.title}
    </h3>
    <p class="post__author">made by <span>${post.user}</span></p>
    <p class="post__text">
    ${post.body} 
    </p>
    </div>
    </div>
    `;
}

function getMethod(post_id, author) {
    document.querySelector('.container').innerHTML = '';
    if(author) {
        getUsersByName(author)
        .then(users => {
            for(let user of users) {
                getPostsByUserID(user.id)
                .then(posts =>{
                    for(let post of posts) {
                        getImgByID(post.id)
                        .then(img => {
                            renderPost(
                                {
                                    id: post.id,
                                    title: post.title,
                                    body: post.body,
                                    user: user.name,
                                    img: img.url
                                }
                            );
                        })
                    }
                } );
            }
        })
        .catch(error => console.log(error));
    }
    else{
        getPostByID(post_id)
        .then(post => {
            Promise.all([getImgByID(post.id), getUserByID(post.userId)])
            .then(([img, user]) => {
                renderPost({
                    id: post.id,
                    title: post.title,
                    body: post.body,
                    user: user.name,
                    img: img.url
                });
            })
        })
        .catch(error => console.log(error));
    }
}

let submitBtn = document.querySelector('input[type="submit"]');
let inputPostID = document.querySelector('input[name="input__postID"]');
let inputUsername = document.querySelector('input[name="input__username"]');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    getMethod(inputPostID.value, inputUsername.value);
});

inputPostID.addEventListener('input', (e) => {
    inputUsername.value = "";
});
inputUsername.addEventListener('input', (e) => {
    inputPostID.value = "";
});