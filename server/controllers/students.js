module.exports = {
    // gives back all students by cohort
    readStudents: (req, res) => {
        const db = req.app.get('db')
        const { cohort } = req.params
        db.read_students(cohort).then(studentsArray => {
            res.status(200).send(studentsArray)
        })
    },
    createStudent: (req, res) => {
        const db = req.app.get('db')
        const { cohort } = req.params
        const {name, email} = req.body
        const newStudent = {
            name,
            cohort,
            email
        }

        db.create_student(newStudent).then(addedStudentId => {

            db.get_comp_titles().then(comp_titles => {
                comp_titles.map((title) => {
                    db.query('INSERT INTO status (comp_id, student_id, passed) VALUES ($1, $2, FALSE)', [title.id, addedStudentId[0].id])
                })
            }).catch(err => console.log(err))

            db.get_assess_titles().then(assessment_titles => {
                assessment_titles.map((title) => {
                    db.query('INSERT INTO assessments_status (assess_id, student_id, passed) VALUES ($1, $2, FALSE)', [title.id, addedStudentId[0].id])
                })
            })

            db.get_html_css_comp_titles().then(html_css_titles => {
                html_css_titles.map((title) => {
                    db.query('INSERT INTO html_css_status (comp_id, student_id, passed) VALUES ($1, $2, FALSE)', [title.id, addedStudentId[0].id])
                })
            }).catch(err => console.log(err))

            

            db.grab_all_students_after_creation(cohort).then(studentsArray => {
                console.log(studentsArray)
                res.status(200).send(studentsArray)
            }).catch(err => console.log(err))
        }).catch(err => {
            res.status(404).send(`SQL error ${err.detail} error code: ${err.code}`)
        })
    },
    editStudent: () => {

    },
    getCohortStatsByAssignment: (req, res) => {
        const db = req.app.get('db')
        const {assignment, cohort} = req.params
        if(assignment === 'assessments'){

            db.assessments_by_cohort(cohort).then(assessTitles => {
                console.log(assessTitles)
                let assessArray = assessTitles.map((title) => {
                    return {assess_id: title.assess_id, title: title.assessment_name, count: 0}
                });

                db.full_class_stats_asses([true, cohort]).then(assessments => {
                    let assessResponse = assessArray.map((title) => {
                            let index = assessments.findIndex(actual => actual.assessment_name == title.title)
                            if(index !== -1){
                                return {assess_id: title.assess_id, name: assessments[index].assessment_name, count: +assessments[index].count}
                            }else{
                                return {assess_id: title.assess_id, name: title.title, count: +title.count}
                            }
                        })

                    res.status(200).send(assessResponse)
                })
            })
            
        }else if (assignment === 'competencies'){
            db.competencies_by_cohort(cohort).then(compTitles => {
                
                let compArray = compTitles.map((title) => {
                        return {comp_id: title.comp_id, title: title.competency_name, count: 0}
                    });
                db.full_class_stats_comps([true, cohort]).then(competencies => {
                    let compResponse = compArray.map((title) => {
                            let index = competencies.findIndex(actual => actual.competency_name == title.title)
                            if(index !== -1){
                                return {comp_id: title.comp_id, name: competencies[index].competency_name, count: +competencies[index].count}
                            }else{
                                return {comp_id: title.comp_id, name: title.title, count: +title.count}
                            }
                        })

                    res.status(200).send(compResponse)
                })
            })
        }else if (assignment === 'html_css'){
            db.html_css_by_cohort(cohort).then(compTitles => {
                
                let compArray = compTitles.map((title) => {
                        return {comp_id: title.comp_id, title: title.competency_name, count: 0}
                    });

                    console.log(cohort)
                db.get_full_class_stats_html_css([true, cohort]).then(competencies => {
                    let compResponse = compArray.map((title) => {
                            let index = competencies.findIndex(actual => actual.competency_name == title.title)
                            if(index !== -1){
                                return {comp_id: title.comp_id, name: competencies[index].competency_name, count: +competencies[index].count}
                            }else{
                                return {comp_id: title.comp_id, name: title.title, count: +title.count}
                            }
                        })

                        console.log(compResponse)

                    res.status(200).send(compResponse)
                })
            })
        }
    },
    getAssignmentsByCohort: (req, res) => {
        const db = req.app.get('db')
        const { cohort } = req.params
        const { assignment } = req.query
        
        switch(assignment){

            case 'assessments':
            db.get_passed_assessments(cohort).then((assessmentsByCohort)=> {
                res.status(200).send(assessmentsByCohort)
            }).catch(err => console.log(err))
            break;

            case 'competencies':
                db.get_passed_competencies(cohort).then((competenciesByCohort)=> {
                    res.status(200).send(competenciesByCohort)
                }).catch(err => console.log(err))
            break;

            case 'html_css':
                db.get_passed_html_css(cohort).then((competenciesByCohort)=> {
                    res.status(200).send(competenciesByCohort)
                }).catch(err => console.log(err))
            break;

            default:
                res.status(404).send('No Assignment by that type for that cohort in the database')
            break;
        } 
    },
    getAssessmentsById: (req, res) => {
        const db = req.app.get('db')
        const { id } = req.params
        db.get_passed_assessment_by_id(id).then((studentAssessments) => {
            res.status(200).send(studentAssessments)
        })
    },
    getHtmlCssById: (req, res) => {
        const db = req.app.get('db')
        const { id } = req.params
        db.get_passed_html_css_by_id(id).then((studentAssessments) => {
            res.status(200).send(studentAssessments)
        })
    },
    markOffHTMLCSS: (req, res) => {
        const db = req.app.get('db');
        const {id} = req.params;
        const  {compName, passed} = req.query;
        db.mark_html_css_complete(id, passed, compName).then((updatedAssessmentList) => {
            res.status(200).send(updatedAssessmentList);
        }).catch(err => console.log(err));
    },
    markOffAssessment: (req, res) => {
        const db = req.app.get('db');
        const {id} = req.params;
        const  {assessmentName, passed} = req.query;
        db.mark_assessment_complete(id, passed, assessmentName).then((updatedAssessmentList) => {
            res.status(200).send(updatedAssessmentList);
        }).catch(err => console.log(err));
    },
    getCompetenciesById: (req, res) => {
        const db = req.app.get('db')
        const { id } = req.params
        db.get_passed_comp_by_id(id).then((studentAssessments) => {
            res.status(200).send(studentAssessments)
        })
    },
    updateNotes: (req, res) => {
        const db = req.app.get('db')
        const { notes, assessId, studentId } = req.body
        const { assignment } = req.params
        console.log(notes, assessId, studentId, assignment)
        switch(assignment){

            case 'assessments':
            db.update_assessment_note([notes, assessId, studentId]).then((assessmentsByCohort)=> {
                res.status(200).send(assessmentsByCohort)
            }).catch(err => console.log(err))
            break;

            case 'competencies':
                db.update_competencies_note([notes, assessId, studentId]).then((competenciesByCohort)=> {
                    console.log(competenciesByCohort)
                    res.status(200).send(competenciesByCohort)
                }).catch(err => console.log(err))
            break;

            case 'html_css':
                db.update_html_css_notes([notes, assessId, studentId]).then((competenciesByCohort)=> {
                    console.log(competenciesByCohort)
                    res.status(200).send(competenciesByCohort)
                }).catch(err => console.log(err))
            break;

            default:
                res.status(404).send('No Assignment by that type for that cohort in the database')
            break;
        }

    },
    markCompComplete: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const { compName, passed } = req.query;
        db.mark_comp_complete(id, passed, compName).then(updatedCompList => {
            res.status(200).send(updatedCompList);
        }).catch(err => console.log(err));
    }
}


