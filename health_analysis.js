const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const patients = [];

function addPatient(){
    //defining the variables - value of the input fields
    const name = document.getElementById("name").value;
    //the checked radioButton
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    if(name && gender && age && condition){
        patients.push({name, gender: gender.value, age, condition})
        //the following methods to be done
        resetForm();
        generateReport();
    }
}

    //resetting the fulfilled form after adding a patient
function resetForm(){
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
}

//retrieving health condition info based on the user input
function searchCondition(){
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";

    fetch('health_analysis.json')
        .then(response => response.json())
        .then(data => {
            const condition = data.conditions.find(item => item.name.toLowerCase() === input);

            if(condition){
                const symptoms = condition.symptoms.join(', ');
                const prevention = condition.prevention.join(', ');
                const treatment = condition.treatment;

                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
                resultDiv.innerHTML += `img src="${condition.imagesrc} alth="hjh">`;
                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong>${treatment}</p>`;
            } else {
                resultDiv.innerHTML = "Couldn´t find anything";
            }
        })
        .catch(error => {
            console.error('Error: ', error);
            resultDiv.innerHTML = 'An error occurred while fetching the data';
        });
}

//run searchCondition function if the btnSearched clicked
btnSearch.addEventListener("click", searchCondition);

//generating a report based on the collected patient data stored in the patients array
function generateReport(){
    const numPatients = patients.length;
    //counters for specific health condition initialized as 0
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };
    //genederConditionsCount an object, which counts the conditions per male/female
    const genderConditionsCount = {
        Male: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
        },
        Female: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
        },
    };

    //iterating over patients array using for loop in order to count the conditions occurence
    for(const patient of patients){
        conditionsCount[patient.condition]++;
        genderConditionsCount[patient.gender][patient.condition]++;
    }

    //showing conditions per patients
    report.innerHTML = `Number of patients: ${numPatients}<br></br>`;
    report.innerHTML += `Conditions breakdown: <br>`;
    for(const condition in conditionsCount){
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`
    }

    //Gender-based conditions showing conditions per gender
    report.innerHTML += `<br>Gender-Based Conditions:<br>`;
    for(const gender in genderConditionsCount){
        report.innerHTML += `${gender}:<br>`;
        for (const condition in genderConditionsCount[gender]){
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        }
    }
}

addPatientButton.addEventListener("click", addPatient);
