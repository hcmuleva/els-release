Feature: Get a course by documentId

Background:
  * url baseUrl
  * configure headers = headers
  * def authData = callonce read('classpath:features/auth.feature')
  * def token = authData.setupData.token
  * def createData = call read('classpath:features/course/create_course.feature')
  * def courseId = createData.courseId
  * print '📦 Using Course ID:', courseId

Scenario: Get the created course
  Given path 'courses', courseId
  And header Authorization = 'Bearer ' + token
  When method get
  Then status 200
  * print '✅ Course fetched successfully:', response
  * match response.data.documentId == courseId
