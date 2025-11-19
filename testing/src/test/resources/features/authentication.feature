# Author : testuser@hph.com
Feature: Scenarios for Authentication

Background:
  * url baseUrl
  * configure headers = headers
  * def email = 'testuser@hph.com'
  * def password = 'Welcome@123'

@register
Scenario: Registration created the user
  Given path 'auth/local'
  And request { identifier: '#(email)', password: '#(password)' }
  When method post
  Then status 200

Scenario: Login returns valid token
  Given path 'auth/local'
  And request { identifier: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  And match response.jwt == "#string"

Scenario: Login and then get users list in one flow
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
