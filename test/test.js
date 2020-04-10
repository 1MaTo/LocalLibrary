const axios = require('axios')
var assert = require('assert');
const md5 = require('md5')
const image = require('./bigImage')

const url = "http://localhost:8181"

/* describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
}); */

const Login = (data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${url}/api/login`, data)
      .then(response => {
        if (response.status === 200) {
          resolve(200)
        }
        else {
          reject(404)
        }
      })
      .catch(error => {
        reject(404)
      })
  })
}

const GetData = (order) => {
  return new Promise((resolve, reject) => {
    axios.get(`${url}/api/books/order/${order}`)
      .then(response => {
        if (response.status === 200) {
          resolve(200)
        } else {
          reject(404)
        }
      })
      .catch(error => {
        reject(404)
      })
  })
}

describe('Тестирование модуля Login', () => {
  describe('Логин - ily4368@gmail.com Пароль - root', () => {
    it('Успешный вход', (done) => {
      const data = {
        email: 'ily4368@gmail.com',
        password: md5('root')
      }
      Login(data)
        .then(response => {
          done()
        })
        .catch(err => {
          done(err)
        })
    })
  })
  describe('Логин - ily1gfd@gmail.com Пароль - rsdnt', () => {
    it('Пользователь не найден', (done) => {
      const data = {
        email: 'ily1gfd@gmail.com',
        password: md5('rsdnt')
      }
      Login(data)
        .then(response => {
          done("Успешный вход")
        })
        .catch(err => {
          done()
        })
    })
  })
})

describe('Тестирование модуля авторизации при попытке доступа к данным', () => {
  describe('Попытка получить книги после авторизации', () => {
    it('Пользователь авторизован, данные получены', (done) => {
      const data = {
        email: 'ily4368@gmail.com',
        password: md5('root')
      }
      Login(data)
        .then(response => {
          GetData('name')
            .then(response => {
              done()
            })
            .catch(err => {
              done(err)
            })
        })
        .catch(err => {
          done(err)
        })
    })
  })
  describe('Попытка получить книги без авторизации', () => {
    it('Пользователь не авторизован, данные не получены', (done) => {
      GetData('name')
        .then(response => {
          done("Данные получены")
        })
        .catch(err => {
          done()
        })
    })
  })
})

describe('Тестирование модуля получения данных', () => {
  describe('Поле сортировки указано корректно (name)', () => {
    it('Данные получены', (done) => {
      const data = {
        email: 'ily4368@gmail.com',
        password: md5('root')
      }
      Login(data)
        .then(response => {
          GetData('name')
            .then(response => {
              done()
            })
            .catch(err => {
              done(err)
            })
        })
        .catch(err => {
          done(err)
        })
    })
  })
  describe('Поле сортировки указано некорректно (namedfdf)', () => {
    it('Данные не получены из за некорректных данных', (done) => {
      const data = {
        email: 'ily4368@gmail.com',
        password: md5('root')
      }
      Login(data)
        .then(response => {
          GetData('asdasd')
            .then(response => {
              done("Данные были получены")
            })
            .catch(err => {
              done()
            })
        })
        .catch(err => {
          done(err)
        })
    })
  })
})