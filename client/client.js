
// James Marks
// 2017-02-14
// Client for mysocial.college

// Login.


// Get accounts and list them on the page.


// If we click an account, show their posts.



function getAccounts() {
  return fetch('/accounts')
    .then(response => response.json());
}
function getPosts(accId) {
  return fetch('/posts/' + accId)
    .then(response => response.json());
}

(function() {

  var $accountsContainer = document.getElementById("accounts");
  var $accountCardTemplate = document.getElementById("account-card");

  var $postsContainer = document.getElementById("posts");
  var $postCardTemplate = document.getElementById("post-card");

  var accounts = [];
  var posts = [];

  getAccounts()
    .then((json) => {
      accounts = json;
      
      for(var index in accounts) {
        var account = accounts[index];

        var accountCard = document.importNode($accountCardTemplate.content, true);
        accountCard.querySelector(".account-heading").innerText = account.accFirstName + ' ' + account.accLastName;
        var link = accountCard.querySelector(".account-posts-link");
        link.accId = account.accId;
        link.addEventListener('click', loadPostsFor);
        
        $accountsContainer.appendChild(accountCard);

      }

      
    })
    .catch((err) => {
      console.error(err);
    });

  function loadPostsFor(e) {
    getPosts(e.target.accId)
        .then(json => {
          posts = json;
          console.log(posts);
          $postsContainer.innerHTML = null;
          for(var index in posts) {
            var post = posts[index];

            var postCard = document.importNode($postCardTemplate.content, true);
            // INFO: const { postId, postTag, postURL, accId } = post;
            postCard.querySelector(".post-text").innerText = post.postBody;
            postCard.querySelector(".post-thumbsup").innerText = post.postThumbsUp;
            postCard.querySelector(".post-thumbsdown").innerText = post.postThumbsDown;
            postCard.querySelector(".post-date").innerText = new Date(post.postDate).toDateString();

            
            $postsContainer.appendChild(postCard);
          }

        })
        .catch(err => console.error(err));
  }


})();