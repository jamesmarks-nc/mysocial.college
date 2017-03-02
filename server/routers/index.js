export { accountRouter } from './accounts';
export { postRouter } from './posts';
export { loginRouter } from './login';

const rolesMap = {
  "ANY" : {
    "/": ['public'],
    "/login": ['public'],
  },
  "GET": {
    "/accounts": ['admin'],
    "/friends": ['user'],
    "/posts": null
  },
  "POST": {
    "/accounts": ['admin'],
    "/post": ['user']
  }
}

export { rolesMap };