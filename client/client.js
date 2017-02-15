
// James Marks
// 2017-02-14
// Client for mysocial.college

function getAccounts() {
  return fetch('/accounts')
    .then(response => response.json())
    // .then((json) => {
    //   console.log(json);
    // })
    .catch((err) => {
      console.error(err);
    });
}

getAccounts()
  .then((json) => {
    console.log(json);
  });
