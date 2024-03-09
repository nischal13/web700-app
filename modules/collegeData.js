// Import the file system module
const fs = require("fs");

// Define a class called Data to store student and course data
class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

// Initialize a variable to hold the data collection
let dataCollection = null;

// Export methods to interact with the data collection
module.exports.initialize = function () {
    // Initialize the data collection by reading course and student data from JSON files
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses");
                return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students");
                    return;
                }

                // Create a new Data object with parsed student and course data
                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

// Retrieve all students from the data collection
module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        // Check if there are any students in the collection
        if (dataCollection.students.length === 0) {
            reject("query returned 0 results");
            return;
        }

        // Resolve with all students
        resolve(dataCollection.students);
    });
}

// Retrieve teaching assistants from the data collection
module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
        // Filter students to find those who are teaching assistants
        const filteredStudents = dataCollection.students.filter(student => student.TA);

        // Check if any teaching assistants were found
        if (filteredStudents.length === 0) {
            reject("query returned 0 results");
            return;
        }

        // Resolve with teaching assistants
        resolve(filteredStudents);
    });
};

// Retrieve all courses from the data collection
module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        // Check if there are any courses in the collection
        if (dataCollection.courses.length === 0) {
            reject("query returned 0 results");
            return;
        }

        // Resolve with all courses
        resolve(dataCollection.courses);
    });
};

// Retrieve a student by their student number from the data collection
module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        // Find a student with the provided student number
        const foundStudent = dataCollection.students.find(student => student.studentNum === num);

        // Check if the student was found
        if (!foundStudent) {
            reject("query returned 0 results");
            return;
        }

        // Resolve with the found student
        resolve(foundStudent);
    });
};

// Retrieve students by their course from the data collection
module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        // Filter students to find those enrolled in the provided course
        const filteredStudents = dataCollection.students.filter(student => student.course === course);

        // Check if any students were found for the course
        if (filteredStudents.length === 0) {
            reject("query returned 0 results");
            return;
        }

        // Resolve with students enrolled in the course
        resolve(filteredStudents);
    });
};

module.exports.addStudent = function(studentData) {
    return new Promise((resolve, reject) => {
      // If TA is undefined, set it to false; otherwise, set it to true
      studentData.TA = studentData.TA === undefined ? false : true;
      
      // Set the studentNum property to the length of the dataCollection.students array plus one
      studentData.studentNum = dataCollection.students.length + 1;
  
      // Push the updated studentData object onto the dataCollection.students array
      dataCollection.students.push(studentData);
  
      // Resolve the promise to indicate successful addition of the student
      resolve();
    });
  };