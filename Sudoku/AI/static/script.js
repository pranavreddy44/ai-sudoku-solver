document.getElementById('solve-button').addEventListener('click', async () => {
    const board = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const cellValue = document.getElementById(`cell-${i}-${j}`).value;
            row.push(cellValue ? parseInt(cellValue) : 0);
        }
        board.push(row);
    }

    const response = await fetch('/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ board })
    });

    const result = await response.json();
    if (result.solved) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                document.getElementById(`cell-${i}-${j}`).value = result.board[i][j];
                document.getElementById(`cell-${i}-${j}`).style.backgroundColor = "#d4edda"; // Green for solved cells
            }
        }
        document.getElementById('result').innerText = 'Sudoku solved!';
    } else {
        document.getElementById('result').innerText = 'No solution exists.';
    }
});

document.getElementById('generate-button').addEventListener('click', async () => {
    const response = await fetch('/generate');
    const result = await response.json();
    const board = result.board;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            document.getElementById(`cell-${i}-${j}`).value = board[i][j] === 0 ? '' : board[i][j];
            document.getElementById(`cell-${i}-${j}`).style.backgroundColor = board[i][j] === 0 ? "#fff" : "#f0f0f0";
        }
    }

    document.getElementById('result').innerText = '';
});

// Validate Sudoku inputs
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('input', () => {
        const [row, col] = cell.id.split('-').slice(1).map(Number);
        const board = [];

        for (let i = 0; i < 9; i++) {
            const rowArr = [];
            for (let j = 0; j < 9; j++) {
                const value = document.getElementById(`cell-${i}-${j}`).value;
                rowArr.push(value ? parseInt(value) : 0);
            }
            board.push(rowArr);
        }

        const num = parseInt(cell.value);
        if (num && !isValidSudoku(board, row, col, num)) {
            cell.style.backgroundColor = "#f8d7da"; // Red for invalid input
        } else {
            cell.style.backgroundColor = "#fff"; // Reset valid input
        }
    });
});

function isValidSudoku(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === num) return false;
        if (i !== row && board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if ((i !== row || j !== col) && board[i][j] === num) return false;
        }
    }
    return true;
}
