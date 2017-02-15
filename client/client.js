
// James Marks
// 2017-02-14
// Client for mysocial.college

fetch('/accounts')
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    console.log(json);
  })
  .catch((err) => {
    console.error(err);
  });
