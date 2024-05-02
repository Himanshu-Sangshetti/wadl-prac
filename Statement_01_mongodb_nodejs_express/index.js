/* ****************Importing Required Modules/Packages***************** */
const express = require("express")
const mongoose = require("mongoose")
const StudentMarks = require("./StudentMarks")
const cors = require('cors');
const app = express()


/* ******************Configuring Middleware(s)***************** */
app.use(cors());
app.use(express.json())


/* ******************Defining Configuration Variables***************** */
const db_connection = "mongodb://127.0.0.1:27017/test"
const port = 3000


/* *********************Defining Routs and Controllers********************* */

// c. Insert array of documents in Collection. 
app.post("/add", async function (request, response) {
    // get data from body
    const { Name, Roll_No, WAD_Marks, CC_Marks, DSBDA_Marks, CNS_Marks, AI_Marks } = request.body
    const student = await StudentMarks.create({ Name, Roll_No, WAD_Marks, CC_Marks, DSBDA_Marks, CNS_Marks, AI_Marks })
    response.send({ message: "Data Is Inserted", student })
})

// d.  Display total count of documents and List all the documents in browser.
app.get("/displayCountAndDocuments", async function (request, response) {
    const students = await StudentMarks.find()
    response.send({ "total count": students.length, students })
})

// e.  List the names of students who got more than 20 marks in DSBDA Subject in browser.
app.get("/getMoreThan20InDSBDA", async function (request, response) {
    const students = await StudentMarks.find({ DSBDA_Marks: { $gt: 20 } }, { Name: 1 }) // 2nd parameter is for displaying only name
    response.send(students)
})

// f.  Update the marks of Specified students by 10.
app.put("/update10Marks/:studentID", async function (request, response) {
    const studentID = request.params.studentID
    const student = await StudentMarks.findOneAndUpdate({ _id: studentID }, { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_Marks: 10 } }, { new: true })
    response.send(student)
})

// g.  List the names who got more than 25 marks in all subjects in browser.
app.get("/getMoreThan25InAll", async function (request, response) {
    const students = await StudentMarks.find({
        WAD_Marks: { $gt: 25 },
        CC_Marks: { $gt: 25 },
        DSBDA_Marks: { $gt: 25 },
        CNS_Marks: { $gt: 25 },
        AI_Marks: { $gt: 25 }
    }, { Name: 1 }) // 2nd parameter is for displaying only name
    response.send(students)
})

// h.  List the names who got less than 40 in both CC and WAD in browser.
app.get("/getMoreThan40In2Subjects", async function (request, response) {
    const students = await StudentMarks.find({
        WAD_Marks: { $lt: 40 },
        CC_Marks: { $lt: 40 },
    }, { Name: 1 }) // 3rd parameter is for displaying only name
    response.send(students)
})  

// j.  Display the Students data in Browser in tabular forma
app.get("/displayAllStudentsInTable", async function (request, response) {
    const students = await StudentMarks.find() 
    response.send(students)
})

// i.  Remove specified student document from collection.
app.delete("/delete/:studentID", async function (request, response) {
    const studentID = request.params.studentID
    const deletedStudent = await StudentMarks.findOneAndDelete({ _id: studentID })
    response.send({ message: "Student Is Deleted Successfully", deletedStudent })
})


/* ***********Database Connection And Starting Express Server********** */
console.log("waiting for database to connect. after connection server will start...")
mongoose.connect(db_connection)
    .then(() => {
        app.listen(port, function () {
            console.log(">>>> Database connected successfully and server is started")
            console.log("http://localhost:" + port)
        })
    })
    .catch((error) => {
        console.log("problem to connect with database")
        console.log(error)
    })
