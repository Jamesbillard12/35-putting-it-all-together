'use strict'

import {Router} from 'express'
import User from '../model/user.js'
import parserBody from './parser-body.js'
import {basicAuth} from './parser-auth.js'
import {log, daysToMilliseconds} from '../lib/util.js'
import superagent from 'superagent'

export default new Router()
.get('/oauth/google/code', (req, res, next) => {
  console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
  if (!req.query.code) {
    res.redirect(process.env.CLIENT_URL);
  } else {
    console.log('1111111111');
    superagent.post('https://www.googleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: req.query.code,
      grant_type: 'authorization_code',
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth/google/code`
    })
    .then(response => {
      console.log('222222222');
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
      .set('Authorization', `Bearer ${response.body.access_token}`)
    })
    .then(response => {
      console.log('333333333333', response.body);
      return User.handleOAUTH(response.body);
    })
    .then(user => user.tokenCreate())
    .then( token => {
      console.log('4444444444444');
      res.cookie('X-Slugchat-Token', token);
      res.redirect(process.env.CLIENT_URL);
    })
    .catch((error) => {
      console.log('555555555555555');
      console.error(error);
      res.redirect(process.env.CLIENT_URL);
    })
  }
})
.post('/signup', parserBody, (req, res, next) => {
  log('__ROUTE__ POST /signup')

  new User.create(req.body)
  .then(user => user.tokenCreate())
  .then(token => {
    res.cookie('X-Sluggram-Token', token, {maxAge: 900000})
    res.cookie('snark-in-the-dark', 'hahahah', {maxAge: 900000})

    res.send(token)
  })
  .catch(next)
})
.get('/usernames/:username', (req, res, next) => {
  User.findOne({username: username})
  .then(user => {
    if(!user)
      return res.sendStatus(409)
    return res.sendStatus(200)
  })
  .catch(next)
})
.get('/login', basicAuth, (req, res, next) => {
  log('__ROUTE__ GET /login')
  req.user.tokenCreate()
  .then((token) => {
    let cookieOptions = {maxAge: daysToMilliseconds(7)}
    res.cookie('X-Sluggram-Token', token, cookieOptions)
    res.send(token)
  })
  .catch(next)
})
