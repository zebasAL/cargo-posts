
const limitWidth = $(`#content-width`).width();
console.log(limitWidth)
const textWidth = $(`#post-full-view`).width();
console.log(textWidth)



function getPost(id) {

    // Get every post
    fetch(`https://gorest.co.in/public/v1/posts/${id}`)
    .then(function(response) {
    if (!response.ok) {
    throw new error (response.status);
    }
    return response.json(); })
    .then(function (res) {        
      
        // get the user linked to the post
        fetch(`https://gorest.co.in/public/v1/users/${res.data.user_id}`)
        .then(function(response) { return response.json(); })
        .then(function(userResponse) {
                    
            // print post
            $('#post-full-view').append(
                    `<section class="full-post">
                    <div>
                        <h2>${res.data.title}</h2>
                    <div>
                        <p>${res.data.body}</p>
                    </div>
                        <p>${userResponse.data.name}</p>
                        <p>${userResponse.data.email}</p>
                    </div>
                </section>
            `);
            $('#posts-loading').hide();
                let comments = '';
                
            fetch(`https://gorest.co.in/public/v1/posts/${id}/comments`)
            .then(function(response) { 
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json(); })
            .then(function(commentResponse) {

                commentResponse.data.forEach(function(comment, commentIndex) {

                    comments = `${comments}
                        <div id="comment-bar-${comment.id}" class="comments-bar">
                            <div class="card-box-comments">
                                <div class="title-card-comments">
                                    <p>${comment.email}</p>
                                </div>
                                <div>
                                    <h2>${comment.name}</h2>
                                    <p id="comment-${comment.id}" class="description-comments">
                                        ${comment.body}
                                    </p>
                                    <div class="comments-buttons">
                                        ${((comment.body.length * 7.5) > limitWidth )
                                            ? (
                                            `<div><button data-id="${comment.id}" id="button-${comment.id}" class="read-more-button">Read More<i class="arrow-down"></i></button></div>`
                                        ) : ''}
                                        <button data-id="${comment.id}" id="delete-comment" class="comment-delete-btn">Delete X</button>
                                    </div>
                                </div>
                            </div>
                        </div>`

                    if (commentResponse.data.length -1 === commentIndex) {
                    $('#comments-full-view').prepend(comments)
                    $('#add-comment-form').show()
                    $('.comments-title').show()
                    }
                })
                $('#add-comment-form').show()
                $('.comments-title').show()
                $('#comments-full-view').append('<h3>Comments not found</h3>');
                if (commentResponse.data.length > 0) {
                    $('div#comments-full-view h3').hide();
                };
            })
            .catch(function(err) {
            console.log(err)
            });
            
        });
    })
    .catch(function(error) {
        window.location.replace("/Users/zebas/Desktop/cargo-landing/index.html");
    });
}

$(document).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = urlParams.get('id');
    // getPost();
    getPost(id)
});


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get('id');

$(document).on('submit', '#add-comment-form', function(event) {
    event.preventDefault();

    const values = $(this).serialize();
    const fields = new URLSearchParams(values);

    const name = fields.get('name');
    const email = fields.get('email');
    const body = fields.get('body');

    const data = { 
        'name': name,
        'email': email,
        'body': body
    };

    fetch(`https://gorest.co.in/public/v1/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 7474a39a8f8d07fa4adf0e58a2357b51b0342e6da64531b61c32230816539a7d'
        },
        body: JSON.stringify(data),
    })
    .then(function(response) { 
        if (!response.ok) {
            throw new Error(JSON.stringify(response.data));
        }
        return response.json();
    })
    .then(function(newCommentBack) {
        
        $('#email-input').val('');
        $('#name-input').val('');
        $('#body-input').val('');

           
            commentSubmited = `
                <div id="comment-bar-${newCommentBack.data.id}" class="comments-bar">
                    <div class="card-box-comments">
                        <div class="title-card-comments">
                            <p>${newCommentBack.data.email}</p>
                        </div>
                        <div>
                            <h2>${newCommentBack.data.name}</h2>
                            <p id="comment-${newCommentBack.data.id}" class="description-comments">
                                ${newCommentBack.data.body}
                            </p>
                            <div class="comments-buttons">
                                ${(newCommentBack.data.body.length > 100)
                                    ? (
                                    `<div><button data-id="${newCommentBack.data.id}" id="button-${newCommentBack.data.id}" class="read-more-button">Read More<i class="arrow-down"></i></button></div>`
                                ) : ''}
                                <button data-id="${newCommentBack.data.id}" id="delete-comment" class="comment-delete-btn">Delete X</button>
                            </div>
                        </div>
                    </div>
                </div>`
                    
            $('#comments-full-view').prepend(commentSubmited);

            if ($(".card-box-comments")[0]) {
                $('div#comments-full-view h3').hide()
            }
    })
    
    .catch((error) => {
        alert('Message is too long, try to shorten');
    });
    
});


$(document).on('click', '.read-more-button', function() {
    const commentId = $(this).attr('data-id');

    if ($(`#comment-${commentId}`).hasClass('expanded')) {
        // comment is expanded, then it must be reduced
        $(`#comment-${commentId}`).removeClass('expanded');
        $(`#button-${commentId}`).html('Read More<i class="arrow-down"></i>');
    } else {
        // not expanded yet, comment must be expanded
        $(`#comment-${commentId}`).addClass('expanded');
        $(`#button-${commentId}`).html('Read Less<i class="arrow-up"></i>');
    }
});


$(document).on('click', '.comment-delete-btn', function() {
    
    const commentId = $(this).attr('data-id');
       
    fetch(`https://gorest.co.in/public/v1/comments/${commentId}`, {
        method: 'DELETE', 
        headers: {
        'Content-type': 'application/json; charset=UTF-8', 
        Authorization: 'Bearer 7474a39a8f8d07fa4adf0e58a2357b51b0342e6da64531b61c32230816539a7d' // Indicates the content 
        },
        body: null
    })
    .then(function(response) {})
    .then(function(data) {
        $(`#comment-bar-${commentId}`).remove();  
        if (($(".card-box-comments").length === 0)) {
            $('div#comments-full-view h3').show()
        } else {
            $('div#comments-full-view h3').hide()
        } 
    })

});

