/* eslint-disable object-shorthand */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
class UserHandler {
  constructor (service, validator) {
    this._service = service,
    this._validator = validator
  }

  async postUserHandler (request, h) {
    this._validator.validateUserPayload(request.payload)

    const userId = await this._service.addUser(request.payload)

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId: userId
      }
    })
    response.code(201)
    return response
  }

  async getUserHandler (request) {
    const { id } = request.params
    const user = await this._service.getUserById(id)

    return {
      status: 'success',
      data: {
        user
      }
    }
  }
}

module.exports = UserHandler
