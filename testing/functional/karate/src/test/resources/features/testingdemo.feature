Feature: CRUD operation automation

@Create
Scenario: Post request

Given url 'https://jsonplaceholder.typicode.com/users'
And request 
"""
{ 
"name": "Gourav",
"username": "muleva" ,
"email": "gourav.email@example.com"
}

"""
When method post
Then status 201
And match response.name == 'Gourav'
And match response.username == 'muleva'


@readorget
Scenario: This is Read
Given url 'https://jsonplaceholder.typicode.com/users/2'
When method get
Then status 200

@updatedata
Scenario: Update user
Given url 'https://jsonplaceholder.typicode.com/users/2'
And request 
"""
{ "name": "hiitest",
    "username": "hiitest" ,
    "email": "gourav.email@example.com"
    }
"""
When method put
Then status 200
And match response.name == 'hiitest'
And match response.username == 'hiitest'


@Delete
Scenario: Delete user
Given url 'https://jsonplaceholder.typicode.com/users/2'
When method delete
Then status 200