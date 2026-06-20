const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '..', 'docs', 'employee.json');
const outputPath = path.resolve(__dirname, '..', '..', 'test-results', 'EmployeeDetails.html');

// Read employee data from the repository docs folder.
const employees = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const rows = employees
    .map(
        (emp) => {
            const salary = Number(emp.Salary || 0);
            const bonus = salary * 0.1;
            const finalSalary = salary + bonus;
            return `
            <tr>
                <td>${emp.ID}</td>
                <td>${emp.Name}</td>
                <td>${emp.User}</td>
                <td>${emp.Password}</td>
                <td>${salary.toFixed(2)}</td>
                <td>${bonus.toFixed(2)}</td>
                <td>${finalSalary.toFixed(2)}</td>
            </tr>`;
        }
    )
    .join('');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMPLOYEE DETAILS</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        h1 {
            text-align: center;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #4caf50;
            color: white;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
    <h1>EMPLOYEE DETAILS</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>User</th>
                <th>Password</th>
                <th>Salary</th>
                <th>Bonus (10%)</th>
                <th>Salary + Bonus</th>
            </tr>
        </thead>
        <tbody>${rows}
        </tbody>
    </table>
</body>
</html>
`;

fs.writeFileSync(outputPath, htmlContent, 'utf8');
console.log(`HTML report generated successfully: ${outputPath}`);
