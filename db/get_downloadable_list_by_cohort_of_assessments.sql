SELECT students.*, assessments.assessment_name, assessments_status.assess_id, assessments_status.passed FROM students
JOIN assessments_status on(assessments_status.student_id = students.id)
JOIN assessments on(assessments.id = assessments_status.assess_id)
WHERE students.cohort = $1 AND assessments_status.passed = true
ORDER BY assessments.id;