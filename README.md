<<<<<<< HEAD
Task Planner
============================



########Software positioning and basic functions 

This application is aimed to build a web-based affective task planner. The main functions 
are user is able to add the task, manage he/she's task plan. The system is able to evaluation 
the finished task give user feedback, have a heatmap to show the daily mood, give suggestions
about modify tomorrow's plan.


########Enviroment required
 node v10.15.2


########Databases required
 mongo shell version v3.6.8 



########Activation order
 This system run on the Linux system
 
 1.npm install

 2.node server/app.js

 3.npm start


########Directory structure

├── Readme.md                   // help                        
├── src                     	// web implementation 
│   ├── assets
│   │        └── imgs
│   ├── components 
│   │        └── render-if               
│   ├── context  
│   │	   └── user.js                       
│   ├── pages 
│   │        └── User
│   │		 ├──Log-in
│   │		 │	├──index.css
│   │		 │	└──index.jsx
│   │		 ├──Main
│   │		 │	├──components
│   │		 │	│	├──calender
│   │		 │	│	│	├──index.css
│   │		 │	│	│	└──index.jsx
│   │		 │	│	├──home
│   │		 │	│	│	├──index.css
│   │		 │	│	│	└──index.jsx
│   │		 │	│	├──review
│   │		 │	│	│	├──index.css
│   │		 │	│	│	└──index.jsx
│   │		 │	│	└──task
│   │		 │	│		├──index.css
│   │		 │	│		└──index.jsx
│   │		 │	├──index.css
│   │		 │	└──index.jsx
│   │		 ├──Rest-PW
│   │		 │	├──index.css
│   │		 │	└──index.jsx
│   │		 └──Sign-up
│   │			├──index.css
│   │			└──index.jsx             
│   ├── router 
│   │	    └──index.js        
│   ├── utils                                //tools
│   │	   ├── index.js
│   │	   ├── fetch.js
│   │	   └── axios.js 
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   └── serviceWorker.js
├── server                                   // local server
│   ├── config
│   │        └── index.js
│   ├── filter 
│   │        └── user.js              
│   ├── models
│   │	   ├──Tasks.js  
│   │	   └── User.js                       
│   ├── routes 
│   │	   ├──tasks.js  
│   │	   └──user.js  
│   ├── utils 
│   │        └── index.js
│   └── app.js
├── doc                         
├── public                      
├── node_modules
├── package.json
├── package-lock.json                    
└── test




=======
# a-web-based-affective-task-planner
University graduate project.  
>>>>>>> 4b50f083fd9121da2f4b773f7a203f1a34443aa2
