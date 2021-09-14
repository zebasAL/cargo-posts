

let prevPage = '';
let currentPage = 'https://gorest.co.in/public/v1/posts';
let nextPage = '';


function getPosts(pageUrl = currentPage) {
    $('#posts-loading').show();
    $('#posts-wrapper').html('');
    $('#pagination-container').hide();

    // Get every post
    fetch(pageUrl)
        .then(function(response) { return response.json(); })
        .then(function (res) {
            prevPage = res.meta.pagination.links.previous;
            currentPage = res.meta.pagination.links.current;
            nextPage = res.meta.pagination.links.next;

            // block first and last page
            if (nextPage === null && !$('#load-more-posts-btn').hasClass('button-disabled')) {
                $('#load-more-posts-btn').addClass('button-disabled');
            } else {
                $('#load-more-posts-btn').removeClass('button-disabled');
            }

            if (prevPage === null && !$('#load-previous-posts-btn').hasClass('button-disabled')) {
                $('#load-previous-posts-btn').addClass('button-disabled');
            } else {
                $('#load-previous-posts-btn').removeClass('button-disabled');
            }

            let aggregator = '';
            
            // iterate every post
            res.data.forEach(function(post, postIndex) {
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
                                <a class="learn-more-link" href="./view-case-study.html?id=${post.id}">View Case Study <img class="icon" src="../assets/east_white_24dp.svg">
                                    
                                </a>
                            </div>
                        </div>
                    `;

                    if (res.data.length - 1 === postIndex) {
                        // Last iteration - proceed to append the aggregator html code to the document
                        $('#posts-loading').hide();
                        $('#posts-wrapper').append(aggregator);
                        $('#pagination-container').show();
                    }
                });
                
            });
        });
};

function handlePage(isNextPage) {
    if (isNextPage) {
        getPosts(nextPage);
    } else {
        getPosts(prevPage);
    }
};

$(document).ready(function() {
    // call getPosts
    getPosts();

    $(document).on('click', '#load-more-posts-btn', function() {
        handlePage(true);
    });

    $(document).on('click', '#load-previous-posts-btn', function() {
        handlePage(false);
    });
});

