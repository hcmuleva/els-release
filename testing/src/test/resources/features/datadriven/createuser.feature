Feature: Data Driven Testing Feature for POST API

@datadriven
Scenario Outline: Create user using data-driven table
    Given url 'https://jsonplaceholder.typicode.com/users'
    And request
    """
    {
      "name": "<name>",
      "username": "<username>",
      "email": "<email>",
      "phone": "<phone_no>"

    }
    """
    When method post
    Then status 201
    And match response.name == "<name>"
    And match response.username == "<username>"
    And match response.email == "<email>"
    And match response.phone == "<phone_no>"

Examples:
    | name           | username | email               | phone_no |
    | Leanne Graham  | Bret     | Sincere@april.biz   | 123 |
    | Ervin Howell   | Antonette| Shanna@melissa.tv   | 256 |
    | Clementine Bauch| Samantha| Nathan@yesenia.net  | 2627|
    |Harish| Muleva| Harish@a.net  | 765 |
       | | |   |  |

    
    
