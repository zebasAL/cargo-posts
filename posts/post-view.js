
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
                let comments = '';
                
                        fetch(`https://gorest.co.in/public/v1/posts/${id}/comments`)
                        .then(function(response) { 
                        if (!response.ok) {
                        throw new Error(response.status);
                        }
                        return response.json(); })
                        .then(function(commentResponse) {

                            commentResponse.data.forEach(function(comment, commentIndex) {
                            console.log(comment)
                            comments = `${comments}
                                <div class="comments-bar">
                                        <div class="card-box-comments">
                                            <div class="title-card-comments">
                                                <p>${comment.email}</p>
                                            </div>
                                            <div>
                                                <h2>${comment.name}</h2>
                                                <p id="comment-${comment.id}" class="description-comments">
                                                    ${comment.body}
                                                </p>
                                                <div>
                                                    ${(comment.body.length > 100)
                                                        ? (
                                                        `<div><button data-id="${comment.id}" id="button-${comment.id}" class="read-more-button">Read More<i class="arrow-down"></i></button><button class="comment-delete-btn">Delete X</button></div>`
                                                    ) : ''}
                                                </div>
                                            </div>
                                        </div>
                                </div>`
                                if (commentResponse.data.length -1 === commentIndex) {
                                $('#comments-full-view').append(comments)
                                }
                            })
                        });             
                    })
                    .catch(function(err) {
                    console.log('error')
        })
    })

    .catch(function(error) {
        window.location.replace("///C:/Users/zebas/Desktop/cargo-landing/index.html");
    });
}

$(document).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = urlParams.get('id');
    // getPost();
    getPost(id)
});

$(document).on('submit', '#add-comment-form', function(event) {
    event.preventDefault();
    const values = $(this).serialize();

    const fields = new URLSearchParams(values);

    const name = fields.get('name');
    const email = fields.get('email');
    const body = fields.get('body');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    const data = { 
        // 'id': 72,
        // 'post_id': id,
        'name': email,
        'email': name,
        'body': body
    };

    fetch(`https://gorest.co.in/public/v1/posts/${id}/comments`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authentication: '7474a39a8f8d07fa4adf0e58a2357b51b0342e6da64531b61c32230816539a7d'

    },
        body: JSON.stringify(data),
    })

    .then(response => response.json())
    .then(data => {
    console.log('Success:', data);
    })
    .catch((error) => {
    console.error('Error:', error);

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


