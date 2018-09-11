module.exports = {
    readStudents: (req, res) => {
        const db = req.app.get('db');
        db.read_students().then(studentsArray => {
            res.status(200).send(studentsArray);
        })
    },
    createStudent: (req, res) => {
        const db = req.app.get('db');
        const {name, cohort, email} = req.body;
        const newStudent = {
            name,
            cohort,
            email
        }
        db.create_student(newStudent).then(addedStudentId => {
            db.build_comp_list([addedStudentId[0].id, cohort]).then(studentsArray => {
                res.status(200).send(studentsArray);
        })
            
        }).catch(err => {
            res.status(404).send(`SQL error ${err.detail} error code: ${err.code}`)
        })
    },
    readStudentIdAndStatus: (req, res)=> {
        const db = req.app.get('db');
        const {passed} = req.query;
        const {id} = req.params;
        console.log(id, passed);
        db.get_all_passed([id, passed]).then(passedStudentsArray => {
            console.log(passedStudentsArray);
            res.status(200).send(passedStudentsArray)
        })
    },
    readStudentsByCohort: (req, res)=> {
        console.log('hit')
        const db = req.app.get('db');
        const {active} = req.query;
        const {cohort} = req.params;
        db.get_students_by_cohort(cohort).then(cohortStudentsArray => {

            console.log('cohortStudentsArray', cohortStudentsArray)
            res.status(200).send(cohortStudentsArray)
        }).catch(err => {
            console.log(err)
            res.status(404).send(err)
        })
    },
    readStudentById: (req, res) => {
       const db = req.app.get('db');
       const {id} = req.params;
       console.log(id)
       db.get_student_by_id(id).then(student => {
           console.log(student)
           res.status(200).send(student);
       })
    },
    markCompComplete: (req, res) => {
        const db = req.app.get('db');
        const {id} = req.params;
        const {competencyName, passed} = req.query;
        db.markCompComplete(id, passed, competencyName).then(updatedCompList => {
            console.log(updatedCompList)
            res.status(200).send(updatedCompList);
        }).catch(err => console.log(err));
    },
    getStudentsAssessments: (req, res)=> {
        const db = req.app.get('db');
        const {active} = req.query;
        const {cohort} = req.params;
        console.log('', cohort)
        db.get_passed_assessments([cohort, false]).then(cohortStudentsArray => {

            console.log('cohortStudentsArray', cohortStudentsArray)
            res.status(200).send(cohortStudentsArray)
        }).catch(err => {
            console.log(err)
            res.status(404).send(err)
        })
    },
    getStudentAssessmentsById: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        db.get_passed_assessment_by_id(id).then((studentAssessments) => {
            res.status(200).send(studentAssessments)
        })
    },
    markAssessmentComplete: (req, res) => { 
        const db = req.app.get('db');
        const {id} = req.params;
        const  {assessmentName, passed} = req.query;
        db.mark_assessment_complete(id, passed, assessmentName).then((updatedAssessmentList) => {
            res.status(200).send(updatedAssessmentList);
        }).catch(err => console.log(err));
    },
    getFullCohortStats: (req, res) => {
        const db = req.app.get('db');
        const {assignment, cohort} = req.params;
        console.log(cohort, assignment)
        if(assignment === 'assessments'){
            db.get_assess_titles().then(assessTitles => {
                let assessArray = assessTitles.map((title) => {
                    return {title: title.assessment_name, count: 0}
                });

                db.full_class_stats_asses([true, cohort]).then(assessments => {
                    let assessResponse = assessArray.map((title) => {
                            let index = assessments.findIndex(actual => actual.assessment_name == title.title)
                            if(index !== -1){
                                return {name: assessments[index].assessment_name, count: +assessments[index].count}
                            }else{
                                return {name: title.title, count: +title.count}
                            }
                        })

                        console.log(assessResponse);
                    res.status(200).send(assessResponse)
                })
            })
            
        }else if (assignment === 'competencies'){
            db.get_comp_titles().then(compTitles => {
                let compArray = compTitles.map((title) => {
                        return {title: title.competency_name, count: 0}
                    });
                console.log('test comptitles',compArray);
                db.full_class_stats_comps([true, cohort]).then(competencies => {
                    console.log(competencies);
                    let compResponse = compArray.map((title) => {
                            let index = competencies.findIndex(actual => actual.competency_name == title.title)
                            if(index !== -1){
                                return {name: competencies[index].competency_name, count: +competencies[index].count}
                            }else{
                                return {name: title.title, count: +title.count}
                            }
                        })

                        console.log(compResponse);
                    res.status(200).send(compResponse)
                })
            })
        }
    }
}


// const titles = ["Arrays-1", "Arrays-2", "Arrays-3",  "Async + Promises", "Built-In Prototypes", "Callbacks 1", "Callbacks 2", "Closures", "Constructors - classes", "Constructors - functions", "Context 1", "Context 2", "Data Types", "ES6", "For Loops", "Functions 1", "Functions 2", "Scope", "JSON", "Objects", "Prototypes"];
// const fixedArray = titles.map((title) => {
//     return {title: title, count: 0}
// });

// const count = fixedArray.map((title) => {
//     let index = props.context.assignments.findIndex(actual => actual.assessment_name === title.title)
//     if(index !== -1){
//         return props.context.assignments[index].count
//     }else{
//         return title.count
//     }
// })