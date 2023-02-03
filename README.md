# NUDLS

## a. How to setup code and run
### Unzip folder (NUDLS.zip) and open with VS code
### Press F5 to run
### When page loads, click "Initialize" button to run code

## b. Briefly explain how you approached the problem
### i. What you would do differently if you had to do it again
#### 1. Models
##### I had to understand what data I was dealing with so I worked on 2 models and found 4 dinosaurs.
###### DinosaurModel:
###### {
            "id":0,
            "name":"",
            "species":"",
            "gender":"",
            "herbivore":false,
            "digestion_period":0,
            "times_added":[],
            "times_removed":[],
            "times_fed":[],
            "locations":[],
            "times_moved":[],
            "is_hungry":false, 
            "current_location":""
###### } 
###### ZoneModel:
###### {
            "id":"",
            "status":status
###### }
###### StatusModel:
###### {
            "safe":false,
            "maintenance":false
###### }
###### Based on the DinosaurModel location at the current time, herbivore status and hunger status, the StatusModel of the ZoneModel would be determined. 
###### If I had to do it again, I would understand comparison algorithms. This is where I stopped, I couldn't compare the dates and times to update the current 
###### location of each dinosaur. 
###### I would understand how onpageload method works so I don't rely on a button click to execute initialize functions. 
###### I left the UI for last, so I would focus on the view portion instead of only the models and functions. 

### ii. What you learned during the project
###### That my javascript is very rusty. It's not the language I am most confident in, but thanks to Google and other language experience, I could give it a shot. 
###### I need to improve my knowledge and ability to use recursion and algorithms for better programming. 

### iii. How do you think we can improve this challenge
###### Nothing. I like that we're on our own and have to build something from scratch and figure out how to build the UI, how to interact with the data and figure out what data is important. 
