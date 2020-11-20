'use strict'

class Login {
  get rules() {
    return {
      email: 'required|email',
      password: 'required',
    }
  }

  get messages() {
    return {
      'email.required': 'O e-mail já existe',
      'email.email': 'O e-mail não é valido'

    }
  }
}

module.exports = Login
