Feature: Create a course after successful registration and login

Background:
  * url baseUrl
  * configure headers = headers
  * def authData = callonce read('classpath:features/auth.feature')
  * def token = authData.setupData.token
  * print '🧩 Using token from auth:', token

  
@smoke @regression
Scenario: Create a new course entry
  * def coursename = 'course_' + java.util.UUID.randomUUID().toString()

  Given path 'courses'
  And header Authorization = 'Bearer ' + token
  And request { data: { name: '#(coursename)' } }
  When method post
  Then status 201
  * match response.data.name == coursename

  * def courseId = response.data.documentId
  * print '✅ Created courseId:', courseId
  * return { courseId: courseId }
