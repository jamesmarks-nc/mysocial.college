
// James Marks
// 2017-02-14
// Client for mysocial.college

fetch('/accounts')
  .then((response) => {
    response.text();
  })
  .then((json) => {
    console.log(json);
  })
  .catch((err) => {
    console.error(err);
  });
