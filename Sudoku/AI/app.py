from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Sudoku Solver
def is_valid(board, row, col, num):
    for i in range(9):
        if board[row][i] == num or board[i][col] == num:
            return False
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(start_row, start_row + 3):
        for j in range(start_col, start_col + 3):
            if board[i][j] == num:
                return False
    return True

def solve_sudoku(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                for num in range(1, 10):
                    if is_valid(board, row, col, num):
                        board[row][col] = num
                        if solve_sudoku(board):
                            return True
                        board[row][col] = 0
                return False
    return True

# Sudoku Generator
def generate_sudoku():
    base = 3
    side = base * base

    def pattern(r, c): return (base * (r % base) + r // base + c) % side
    def shuffle(s): return random.sample(s, len(s))

    rBase = range(base)
    rows = [g * base + r for g in shuffle(rBase) for r in shuffle(rBase)]
    cols = [g * base + c for g in shuffle(rBase) for c in shuffle(rBase)]
    nums = shuffle(range(1, base * base + 1))

    # Produce board using randomized baseline pattern
    board = [[nums[pattern(r, c)] for c in cols] for r in rows]

    # Remove random cells to make it a puzzle
    squares = side * side
    no_of_hints = random.randint(30, 40)  # Adjust difficulty here
    for i in random.sample(range(squares), squares - no_of_hints):
        board[i // side][i % side] = 0

    return board

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/solve', methods=['POST'])
def solve():
    data = request.json
    board = data['board']
    solved = solve_sudoku(board)
    return jsonify(solved=solved, board=board)

@app.route('/generate')
def generate():
    board = generate_sudoku()
    return jsonify(board=board)

if __name__ == '__main__':
    app.run(debug=True)
