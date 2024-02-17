/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Nischal Maharjan Student ID: 146739222 Date: 17th Feb,2024
*
********************************************************************************/ 


// Set up the HTTP port to use the environment variable PORT if available, or default to 8080
var HTTP_PORT = process.env.PORT || 8080;

// Require necessary modules
var express = require("express");
var app = express();
var path = require("path");
var collegeData = require("./modules/collegeData.js");

// Initialize college data and set up routes
collegeData.initialize()
    .then(() => {
        // Define routes

        // Route to get all students or students by course
        app.get("/students", (req, res) => {
            let course = req.query.course;
            if (course) {
                collegeData.getStudentsByCourse(course)
                    .then(students => {
                        if (students.length > 0) {
                            res.json(students);
                        } else {
                            res.json({ message: "no results" });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ error: "Internal Server Error" });
                    });
            } else {
                collegeData.getAllStudents()
                    .then(students => {
                        if (students.length > 0) {
                            res.json(students);
                        } else {
                            res.json({ message: "no results" });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ error: "Internal Server Error" });
                    });
            }
        });

        // Route to get TAs
        app.get("/tas", (req, res) => {
            collegeData.getTAs()
                .then(tas => {
                    if (tas.length > 0) {
                        res.json(tas);
                    } else {
                        res.json({ message: "no results" });
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: "Internal Server Error" });
                });
        });

        // Route to get all courses
        app.get("/courses", (req, res) => {
            collegeData.getCourses()
                .then(courses => {
                    if (courses.length > 0) {
                        res.json(courses);
                    } else {
                        res.json({ message: "no results" });
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: "Internal Server Error" });
                });
        });

        // Route to get a single student by student number
        app.get("/student/:num", (req, res) => {
            let num = req.params.num;
            collegeData.getStudentByNum(num)
                .then(student => {
                    if (student) {
                        res.json(student);
                    } else {
                        res.json({ message: "no results" });
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: "Internal Server Error" });
                });
        });

        // Route to serve the HTML demo page
        app.get("/htmlDemo", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
        });

        // Route to serve the about page
        app.get("/about", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "about.html"));
        });

        // Route to serve the home page
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "home.html"));
        });

        // Handle 404 - Page Not Found
        app.use((req, res) => {
            res.status(404).send("Page Not Found");
        });

        // Start the server
        app.listen(HTTP_PORT, () => {
            console.log("Server listening on port: " + HTTP_PORT)
        });
    })
    .catch(err => {
        console.error(err);
        console.error("Failed to initialize college data. Server not started.");
    });