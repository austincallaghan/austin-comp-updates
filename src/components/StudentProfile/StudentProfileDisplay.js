import React from "react";
import { Doughnut } from "react-chartjs-2";

const StudentProfile = (props) => {
	let resizerForChartJs = Math.abs(window.screenX) < 991 ? 150 : 75;

	// Numbers to use to calculate Assessment percentages
	let assessmentsPassedCount = 0;
	let assessmentsRemainingCount = 0;
	props.assessments.forEach((assessment) => {
		assessment.passed
			? (assessmentsPassedCount += 1)
			: (assessmentsRemainingCount += 1);
	});
	let totalAssessmentsCount =
		assessmentsPassedCount + assessmentsRemainingCount;
	console.log(resizerForChartJs);
	// Data for Assessment
	const dataAssessment = {
		labels: [
			`Passed ${assessmentsPassedCount}`,
			`Remaining ${assessmentsRemainingCount}`
		],
		datasets: [
			{
				data: [
					parseInt(
						(assessmentsPassedCount / totalAssessmentsCount) * 100,
						10
					),
					parseInt(
						(assessmentsRemainingCount / totalAssessmentsCount) *
							100,
						10
					)
				],
				backgroundColor: [
					"rgba(80, 169, 220, 0.7)",
					"rgb(150, 150, 150)"
				],
				hoverBackgroundColor: [
					"rgba(65, 154, 205, 1)",
					"rgb(125, 125, 125)"
				]
			}
		]
	};
	// Numbers used for Competencies
	let competenciesPassedCount = 0;
	let competenciesRemainingCount = 0;
	// Functional Comps
	props.competencies.forEach((competency) => {
		competency.passed
			? (competenciesPassedCount += 1)
			: (competenciesRemainingCount += 1);
	});
	// HTML & CSS
	props.htmlcss.forEach((competency) => {
		competency.passed
			? (competenciesPassedCount += 1)
			: (competenciesRemainingCount += 1);
	});
	let totalCompetenciesCount =
		competenciesPassedCount + competenciesRemainingCount;

	// Data for Competencies
	const dataCompetencies = {
		labels: [
			`Passed ${competenciesPassedCount}`,
			`Remaining ${competenciesRemainingCount}`
		],
		datasets: [
			{
				data: [
					parseInt(
						(competenciesPassedCount / totalCompetenciesCount) *
							100,
						10
					),
					parseInt(
						(competenciesRemainingCount / totalCompetenciesCount) *
							100,
						10
					)
				],
				backgroundColor: [
					"rgba(80, 169, 220, 0.7)",
					"rgb(150, 150, 150)"
				],
				hoverBackgroundColor: [
					"rgba(65, 154, 205, 1)",
					"rgb(125, 125, 125)"
				]
			}
		]
	};

	const stylePassed = {
		textAlign: "center",
		background: "rgba(100, 255, 100, 0.5)",
		margin: "10px",
		boxShadow: "1px 3px 5px rgba(0, 0, 0, 0.418)",
		padding: "5px"
	};

	const styleLeft = {
		textAlign: "center",
		background: "lightgrey",
		margin: "10px",
		boxShadow: "1px 3px 5px rgba(0, 0, 0, 0.418)",
		padding: "5px"
	};

	const baseStyle = {
		header: {
			fontSize: "20px",
			fontWeight: "700",
			margin: "5px 0"
		}
	};

    const htmlCssLeft =  props.htmlcss.map(competency => {
        return <div style={competency.passed ? stylePassed : styleLeft}>
                    <div style={baseStyle.header}>{competency.category.includes('(Elective)') ? competency.competency_name + ' (Elective)' : competency.competency_name}</div>
                    <div>{competency.description}</div>
                </div>
    }) 

	const competenciesLeft = props.competencies.map((competency) => {
		return (
			<div style={competency.passed ? stylePassed : styleLeft}>
				<div style={baseStyle.header}>{competency.competency_name}</div>
				<div>{competency.description}</div>
			</div>
		);
	});

	const htmlCssLeft = props.htmlcss.map((competency) => {
		return (
			<div style={competency.passed ? stylePassed : styleLeft}>
				<div style={baseStyle.header}>{competency.category.includes('(Elective)') ? competency.competency_name + ' (Elective)' : competency.competency_name}</div>
				<div>{competency.description}</div>
			</div>
		);
	});

	return (
		<div className="student-profile-display-container">
			<div className="student-name-profile">
				<h1>
					{props.assessments[0]
						? `${props.assessments[0].name.toUpperCase()} - ${props.assessments[0].cohort.toUpperCase()}`
						: ""}
				</h1>
			</div>
			<div />
			<div className="student-profile-content-container">
				<div>
					<div>
						<h1>Assesments</h1>
						<div className="percentages-container">
							<span className="comps-left">
								{parseInt(
									(assessmentsPassedCount /
										totalAssessmentsCount) *
										100,
									10
								)}
								%
							</span>
							<Doughnut
								data={dataAssessment}
								height={150}
								redraw={true}
								options={{
									maintainAspectRatio: true,
									responsive: true,
									animation: {
										duration: 0
									}
								}}
							/>
						</div>
					</div>
					<div className="assessment-container">
						<h2>Assessments</h2>
						{assessmentLeft}
					</div>
				</div>
				<div>
					<div>
						<h1>Competencies</h1>
						<div className="percentages-container">
							<span className="comps-left">
								{parseInt(
									(competenciesPassedCount /
										totalCompetenciesCount) *
										100,
									10
								)}
								%
							</span>
							<Doughnut
								data={dataCompetencies}
								height={resizerForChartJs}
								redraw={true}
								options={{
									maintainAspectRatio: true,
									responsive: true,
									animation: {
										duration: 0
									}
								}}
							/>
						</div>
					</div>
					<div className="comp-container">
						<div>
							<h2>Functional Competencies</h2>
							{competenciesLeft}
						</div>
						<div>
							<h2>HTML/CSS Competencies</h2>
							{htmlCssLeft}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StudentProfile;
