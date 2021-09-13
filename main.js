function getPosts() {
    // Get every post
    fetch('https://gorest.co.in/public/v1/posts')
        .then(function(response) { return response.json(); })
        .then(function (res) {

            let aggregator = '';

            // iterate every post
            res.data.forEach(function(post, postIndex) {
                    console.log(post)
                // get the user linked to the post
                fetch(`https://gorest.co.in/public/v1/users/${post.user_id}`)
                .then(function(response) { return response.json(); })
                .then(function(userResponse) {

                    // concatenate the html
                    aggregator = `${aggregator}
                        <div class="card-box">
                            <div class="title-card">
                                <p>${userResponse.data.name}</p>
                                <p>${userResponse.data.email}</p>
                            </div>
                            <div>
                                <h2>${post.title}</h2>
                                <p class="description">
                                    ${(post.body.length < 100) ? post.body : `${post.body.substring(0, 100)}...`}
                                </p>
                            </div>
                            <div>
                                <a class="learn-more-link" href="./posts/view-case-study.html?id=${post.id}">View Case Study <img class="icon" src="./assets/east_white_24dp.svg"></a>
                            </div>
                        </div>
                    `;

                    if (res.data.length - 1 === postIndex) {
                        // Last iteration - proceed to append the aggregator html code to the document
                        $('#posts-loading').hide();
                        $('#posts-wrapper').append(aggregator);
                    }
                });
            });
        });
};

$('document').ready(function() {
    // call getPosts
    getPosts();
});


