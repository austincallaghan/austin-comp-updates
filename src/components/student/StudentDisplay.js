import React from 'react';
import incomplete from '../../styles/media/incomplete-1.svg'
import passed from '../../styles/media/pass.svg';

const StudentDisplay = (props) => {
    let comPassed = 0;
    props.student.map(comp => {
        console.log('comp.passed :', comPassed);
        if(comp.passed){
            comPassed += 1;
        }
    })
    let percentageComplete = (comPassed/33) * 100;
    
    const compList = props.student.map(comp => {
        return <div key={comp.comp_id} style={comp.passed ? {textDecoration: 'line-through', backgroundColor:"#e0d0d0"} : {textDecoration: 'none'}} className='comp-container'>
                    <div>{comp.category}</div>
                    <div>{comp.competency_name}</div>
                    <div>{comp.description}</div>
                    <div className='status-image-container'>{props.user ? comp.passed ? <img onClick={() => props.context.studentMethods.markCompComplete(comp.comp_id, comp.id, !comp.passed)} src={passed}/> : <img onClick={() => props.context.studentMethods.markCompComplete(comp.comp_id, comp.id, !comp.passed)} src={incomplete}/> : ''}</div>
                </div>
    })

    return (
    
        <div className='student-display'>
            {props.student[0] ?
            <div className='st-dis-header-container'>
                <div>
                    <h1>{props.student[0].name} | {props.student[0].cohort}</h1>
                    <h2>{props.student[0].email}</h2>
                </div>
                <h1>{parseInt(percentageComplete)} % Complete </h1>
            </div>
                : ''
            }
            <div className='comp-list-container'>
                {compList}
            </div>
        </div>
    );
};

export default StudentDisplay;