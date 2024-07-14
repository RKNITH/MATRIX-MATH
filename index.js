

function createMatrixInputs(matrixId, rowsId, colsId) {
    const rows = document.getElementById(rowsId).value;
    const cols = document.getElementById(colsId).value;
    const matrixInputs = document.getElementById(matrixId + 'Inputs');

    matrixInputs.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            matrixInputs.innerHTML += `<input type="number" id="${matrixId}_${i}_${j}" style="width: 50px;"> `;
        }
        matrixInputs.innerHTML += '<br>';
    }
}

function calculateMultiplication() {
    const rows1 = document.getElementById('rows1').value;
    const cols1 = document.getElementById('cols1').value;
    const rows2 = document.getElementById('rows2').value;
    const cols2 = document.getElementById('cols2').value;

    if (cols1 != rows2) {
        document.getElementById('result').innerText = 'Matrix multiplication is not possible with these dimensions.';
        return;
    }

    const matrix1 = [];
    const matrix2 = [];

    for (let i = 0; i < rows1; i++) {
        matrix1[i] = [];
        for (let j = 0; j < cols1; j++) {
            matrix1[i][j] = parseFloat(document.getElementById(`matrix1_${i}_${j}`).value);
        }
    }

    for (let i = 0; i < rows2; i++) {
        matrix2[i] = [];
        for (let j = 0; j < cols2; j++) {
            matrix2[i][j] = parseFloat(document.getElementById(`matrix2_${i}_${j}`).value);
        }
    }

    const resultMatrix = [];
    for (let i = 0; i < rows1; i++) {
        resultMatrix[i] = [];
        for (let j = 0; j < cols2; j++) {
            resultMatrix[i][j] = 0;
            for (let k = 0; k < cols1; k++) {
                resultMatrix[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }

    let resultString = '';
    for (let i = 0; i < resultMatrix.length; i++) {
        resultString += '[' + resultMatrix[i].join(' ') + ']\n';
    }

    document.getElementById('result').innerText = resultString;
}


function calculateTranspose() {
    const matrixInput = document.getElementById('transposeMatrix').value;
    const matrix = matrixInput.split(';').map(row => row.split(',').map(Number));

    const rows = matrix.length;
    const cols = matrix[0].length;

    const transpose = [];
    for (let i = 0; i < cols; i++) {
        transpose[i] = [];
        for (let j = 0; j < rows; j++) {
            transpose[i][j] = matrix[j][i];
        }
    }

    let resultString = '';
    for (let i = 0; i < transpose.length; i++) {
        resultString += '[' + transpose[i].join(' ') + ']\n';
    }

    document.getElementById('transposeResult').innerText = resultString;
}

function calculateDeterminant() {
    const matrixInput = document.getElementById('detMatrix').value;
    const matrix = matrixInput.split(';').map(row => row.split(',').map(Number));

    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
            document.getElementById('detResult').innerText = 'Please enter a valid square matrix.';
            return;
        }
    }

    function determinant(matrix) {
        if (matrix.length === 1) return matrix[0][0];
        if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

        let det = 0;
        for (let i = 0; i < matrix.length; i++) {
            const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
            det += ((i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(subMatrix));
        }
        return det;
    }

    const result = determinant(matrix);
    document.getElementById('detResult').innerText = `Determinant: ${result}`;
}

function calculateInverse() {
    const matrixInput = document.getElementById('inverseMatrix').value;
    const matrix = matrixInput.split(';').map(row => row.split(',').map(Number));

    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
            document.getElementById('inverseResult').innerText = 'Please enter a valid square matrix.';
            return;
        }
    }

    function getMatrixInverse(matrix) {
        const size = matrix.length;
        const identityMatrix = Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => (i === j ? 1 : 0)));

        for (let i = 0; i < size; i++) {
            let diagElement = matrix[i][i];
            if (diagElement === 0) {
                for (let k = i + 1; k < size; k++) {
                    if (matrix[k][i] !== 0) {
                        [matrix[i], matrix[k]] = [matrix[k], matrix[i]];
                        [identityMatrix[i], identityMatrix[k]] = [identityMatrix[k], identityMatrix[i]];
                        diagElement = matrix[i][i];
                        break;
                    }
                }
            }

            if (diagElement === 0) {
                return null;
            }

            for (let j = 0; j < size; j++) {
                matrix[i][j] /= diagElement;
                identityMatrix[i][j] /= diagElement;
            }

            for (let k = 0; k < size; k++) {
                if (k !== i) {
                    const factor = matrix[k][i];
                    for (let j = 0; j < size; j++) {
                        matrix[k][j] -= factor * matrix[i][j];
                        identityMatrix[k][j] -= factor * identityMatrix[i][j];
                    }
                }
            }
        }

        return identityMatrix;
    }

    const result = getMatrixInverse(matrix);
    if (result === null) {
        document.getElementById('inverseResult').innerText = 'The matrix is singular and does not have an inverse.';
    } else {
        let resultString = '';
        for (let i = 0; i < result.length; i++) {
            resultString += '[' + result[i].join(' ') + ']\n';
        }
        document.getElementById('inverseResult').innerText = resultString;
    }
}

function calculateCramersRule() {
    const matrixInput = document.getElementById('cramerMatrix').value;
    const constantsInput = document.getElementById('cramerConstants').value;
    const matrix = matrixInput.split(';').map(row => row.split(',').map(Number));
    const constants = constantsInput.split(',').map(Number);

    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
            document.getElementById('cramerResult').innerText = 'Please enter a valid square matrix.';
            return;
        }
    }

    function determinant(matrix) {
        if (matrix.length === 1) return matrix[0][0];
        if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

        let det = 0;
        for (let i = 0; i < matrix.length; i++) {
            const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
            det += ((i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(subMatrix));
        }
        return det;
    }

    const detA = determinant(matrix);
    if (detA === 0) {
        document.getElementById('cramerResult').innerText = 'The determinant is zero; no unique solution exists.';
        return;
    }

    const results = [];
    for (let i = 0; i < n; i++) {
        const Ai = matrix.map(row => row.slice());
        for (let j = 0; j < n; j++) {
            Ai[j][i] = constants[j];
        }
        results.push(determinant(Ai) / detA);
    }

    document.getElementById('cramerResult').innerText = `Solutions: ${results.join(', ')}`;
}

function checkConsistency() {
    const matrixInput = document.getElementById('consistencyMatrix').value;
    const constantsInput = document.getElementById('consistencyConstants').value;
    const matrix = matrixInput.split(';').map(row => row.split(',').map(Number));
    const constants = constantsInput.split(',').map(Number);

    const augmentedMatrix = matrix.map((row, i) => [...row, constants[i]]);
    const rowEchelon = rowEchelonForm(augmentedMatrix);

    let consistent = true;
    for (let i = 0; i < rowEchelon.length; i++) {
        if (rowEchelon[i].slice(0, -1).every(v => v === 0) && rowEchelon[i][rowEchelon[i].length - 1] !== 0) {
            consistent = false;
            break;
        }
    }

    document.getElementById('consistencyResult').innerText = consistent ? 'The system is consistent.' : 'The system is inconsistent.';
}

function rowEchelonForm(matrix) {
    const m = matrix.length, n = matrix[0].length;
    for (let i = 0; i < m; i++) {
        // Find pivot
        let pivot = i;
        while (pivot < m && matrix[pivot][i] === 0) {
            pivot++;
        }
        if (pivot === m) continue; // No pivot found

        // Swap rows
        if (pivot !== i) {
            [matrix[i], matrix[pivot]] = [matrix[pivot], matrix[i]];
        }

        // Eliminate below
        for (let j = i + 1; j < m; j++) {
            const factor = matrix[j][i] / matrix[i][i];
            for (let k = i; k < n; k++) {
                matrix[j][k] -= factor * matrix[i][k];
            }
        }
    }
    return matrix;
}