const md5 = require('md5')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'kevin',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

//create view 'No_Password' from db table that displays a version of the table without passwords
const getUsers = (request, response) => {
    pool.query('SELECT * FROM NO_Password ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
     // hash(results)
     // response.sendFile(path.join(__dirname,'views.html'))
      response.status(200).json(results.rows)
    })
  }

  //while using postman comment out lines 28 - 32 to createSession
  const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      // if (error) {
      //   throw error
      // }
      console.log(md5(JSON.stringify(results)))
      //response.status(200).json(results.rows)
    })
  }

  const createUser = (request, response) => {
    const { firstname, lastname, age, password, email } = request.body
  
    pool.query('INSERT INTO users (firstname, lastname, age, password, email) VALUES ($1, $2, $3, $4, $5) RETURNING id', [firstname, lastname, age, password, email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.insertId}`)
    })
  }
  //create first user session - on sign_in
  const createSession = (request, response) => {
    const { email, password } = request.body
     // if (email && password){
        pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], (error, results) => {
        console.log(results.rowCount)
        if (results.rowCount > 0) {
        request.session.loggedin = true;
        request.session.results = results.rows
        //response.redirect('/users/:id')
        //response.redirect('/sign_out')
        response.sendFile(path.join(__dirname,'views.html'))
        console.log(results.rows)
        console.log("signed in")

       // response.send('Welcome, user!')
        }
        else {
        console.log("hi")
        // response.send('Incorrect email and/or Password!');
        }			
        response.end()
    })
   // } 
    // else {
    //   response.send('Please enter Username and Password!');
    //   response.end();
    // }
  };



  const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { firstname, lastname, age, password, email, } = request.body
    if (request.session.loggedin) {
    pool.query(
      'UPDATE users SET firstname = $1, lastname = $2, age = $3, password = $4, email = $5 WHERE id = $6',
      [firstname, lastname, age, password, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        
        response.status(200).send(`User modified with ID: ${id}`)
        console.log(md5(JSON.stringify(results)))
      }
    )
    } else {
      response.send("log in bitch")
     }
  }

  const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)
    if (request.session.loggedin) {
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    request.session.loggedin = false;
      if (error) {
        throw error
      } 
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  } else {
    response.send("log in")
  }
  }

  const signOutUser = (request, response) => {
    if (request.session.loggedin) {
    const id = parseInt(request.params.id)
      //console.log(request)
      pool.query('SELECT FROM users WHERE id = $1', [id], (error, results) => {
      console.log(request)
      request.session.loggedin = false;
        if (error) {
          throw error
        }
        response.status(200).send(`User signed out`)
      })
      //response.status(200).send(`User signed out`)
      console.log("yes")
    } else {
      console.log("no")
    }
    }

  module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    createSession,
    signOutUser,
  }