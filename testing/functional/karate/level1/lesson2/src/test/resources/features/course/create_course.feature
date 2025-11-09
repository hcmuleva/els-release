Feature: Create a business after successful registration and login

Background:
  * url baseUrl
  * configure headers = headers
  * def setupData = callonce read('../setup.feature')
  * def authToken = setupData.token
  * def userId = setupData.userId
  * def username = setupData.username
  * print '🧩 Using user:', username, 'ID:', userId


Scenario: Create a new business entry
  * def coursename = 'course_' + java.util.UUID.randomUUID().toString()

  Given path 'courses'
  And header Authorization = 'Bearer ' + authToken
  And request { data: {  name: '#(coursename)' } }
  When method post
  Then status 201

  * print '✅ Business created successfully:', response
  * match response.data.name == coursename

* def courseId= response.data.documentId
* karate.set('courseId', courseId)



Scenario: Get  a new Course by documentId
  * def coursename = 'course_' + java.util.UUID.randomUUID().toString()
  * def courseId= karate.get('courseId')
  Given path 'courses'+'/' + courseId
  And header Authorization = 'Bearer ' + authToken
 
  When method get
  Then status 200

  * print '✅ Get CourseId successfully:', response
  * match response.data.documentId == courseId
