# Author : testuser@hph.com
Feature: Scenarios for Authentication

Background:
  * url baseUrl
  * configure headers = headers
  * def uuid = java.util.UUID.randomUUID() + ''
  * def email = 'testuser_' + uuid + '@hph.com'
  * def username = 'user_' + uuid
  * def password = 'Welcome@123'

@register @auth
Scenario: Registration created the user
  Given path 'auth/local/register'
  And request { username: '#(username)', email: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  And match response.jwt == "#string"
  And match response.user.email == email

Scenario: Login returns valid token
  # Register first
  Given path 'auth/local/register'
  And request { username: '#(username)', email: '#(email)', password: '#(password)' }
  When method post
  Then status 200

  # Then Login
  Given path 'auth/local'
  And request { identifier: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  And match response.jwt == "#string"

@login @@auth
Scenario: Login and then get users list in one flow
  # Register first
  Given path 'auth/local/register'
  And request { username: '#(username)', email: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  
  # Then Login
  Given path 'auth/local'
  And request { identifier: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  * def authToken = response.jwt
  * print 'Token =', authToken

  Given path 'users'
  And header Authorization = 'Bearer ' + authToken
  When method get
  Then status 200

  * def firstUser = response[0]
  * match firstUser.id != null
  * match firstUser.username != null
  * match firstUser.email != null
