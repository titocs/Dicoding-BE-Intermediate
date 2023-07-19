/* eslint-disable no-trailing-spaces */
const AuthenticationHandler = require('./handler')
const routes = require('./routes')
 
module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authenticationServices,
    userServices,
    tokenManager,
    validator
  }) => {
    const authenticationHandler = new AuthenticationHandler(
      authenticationServices,
      userServices,
      tokenManager,
      validator
    )
    server.route(routes(authenticationHandler))
  }
}
