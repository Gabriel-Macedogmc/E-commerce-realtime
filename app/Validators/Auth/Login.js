'use strict'

class Login {
  get rules() {
    return {
      email: 'requerid|email',
      password: 'required',
    }
  }
}

module.exports = Login
