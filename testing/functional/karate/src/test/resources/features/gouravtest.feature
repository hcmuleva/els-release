Feature: This is for practice

@gourav @smoke1
Scenario: First practice
* print "Hello World"
@harish @smoke1
Scenario: Harish is testing
* print "Hello Harish"

@payload
Scenario: payload testing
* def payload = {"name": "Harish", "age":35}
* print "Payload =", payload
*  print payload.name
* print payload.age

@smoke1

Scenario: Testing local host

  Given url 'http://localhost:1337/api/auth/local'
  And request 
    """
    {
      "identifier": "testuser@hph.com",
      "password": "Welcome@123"
    }
    """
  When method post
  Then status 200


@matchresponse
Scenario: match the response getting right or wrong
    Given url 'https://jsonplaceholder.typicode.com/users/1'
    When method get
    Then status 200
    And match response.name == "Leanne Graham"
    And match response.username == "Bret"

@Postmethod
Scenario:Create data
    Given url 'https://jsonplaceholder.typicode.com/posts'
        
    And request
         """ 
        {
        "userId": 1,
        "id": 2,
        "title": "Gourav aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
        }
        """
    When method post
    Then status 201

@Putrequest

  Scenario: Successfully update an existing user's details
    Given url 'https://jsonplaceholder.typicode.com/users/2'
    And request
      """
      {
        "name": "muleva",
        "email": "gourav.email@example.com"
      }
      """
    When method PUT
    Then status 200
    @Putrequest

  Scenario: Successfully update an existing user's details
    Given url 'https://jsonplaceholder.typicode.com/users/2'
    And request
      """
      {
        "name": "muleva",
        "email": "gourav.email@example.com"
      }
      """
    When method PUT
    Then status 200
    And match response.name == 'muleva'
    And match response.email == 'gourav.email@example.com'

   @Deleterequest
Scenario: Delete User

    Given url 'https://jsonplaceholder.typicode.com/users/2'
    When method delete
    Then status 200

   