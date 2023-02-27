type CellValue = 'X' | 'O' | null| 'draw';

class TicTacToeGame {
  private gameState: {
    board: CellValue[][],
    currentPlayer: 'X' | 'O',
    winner: CellValue | null,
  };

  private gameElement:HTMLElement
  private messageElement:HTMLElement
  private cellsWrapperElement:HTMLElement

  constructor() {
    this.gameElement = document.createElement('div')
    this.gameState = {
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      currentPlayer: 'X',
      winner: null,
      
    };
    this.createGame()
  }

  private handleCellClick(row: number, col: number) {
    if (this.gameState.board[row][col] !== null) {
      return;
    }

    this.gameState.board[row][col] = this.gameState.currentPlayer;
    this.gameState.currentPlayer = this.gameState.currentPlayer === 'X' ? 'O' : 'X';

    this.gameState.winner = this.checkForWinner();
    const isDraw = this.checkForDraw();
    if (isDraw) {
    this.gameState.winner = 'draw';
}
    this.updateGame();
  }

  private checkForWinner(): CellValue | null {
    for (let row = 0; row < 3; row++) {
      if (
        this.gameState.board[row][0] === this.gameState.board[row][1] &&
        this.gameState.board[row][1] === this.gameState.board[row][2]
      ) {
        return this.gameState.board[row][0];
      }
    }

    for (let col = 0; col < 3; col++) {
      if (
        this.gameState.board[0][col] === this.gameState.board[1][col] &&
        this.gameState.board[1][col] === this.gameState.board[2][col]
      ) {
        return this.gameState.board[0][col];
      }
    }

    if (
      this.gameState.board[0][0] === this.gameState.board[1][1] &&
      this.gameState.board[1][1] === this.gameState.board[2][2]
    ) {
      return this.gameState.board[0][0];
    }
    if (
      this.gameState.board[0][2] === this.gameState.board[1][1] &&
      this.gameState.board[1][1] === this.gameState.board[2][0]
    ) {
      return this.gameState.board[0][2];
    }

    return null;
  }


  private checkForDraw(): boolean {
    const board = this.gameState.board;
      for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === null) {
          return false;
        }
      }
    }
      return this.gameState.winner === null;
  }

  public getElement = () :HTMLElement =>{
    this.gameElement.classList.add('game-board');
    return this.gameElement
  }

  private resetGame = () => {
    this.gameState = {
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      currentPlayer: 'X',
      winner: null,
    };
    this.updateGame();
}

    private saveScore = () => {
    const score = {
      player: this.gameState.winner,
      date: new Date().toLocaleString()
    };
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
  };

  private showScores = () => {
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');
    const scoreList = document.createElement('ul');
    scores.forEach(score => {
      const scoreItem = document.createElement('li');
      scoreItem.innerText = `${score.player} - ${score.date}`;
      scoreList.appendChild(scoreItem);
    });
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', () => {
      overlay.remove();
    });
    modal.appendChild(scoreList);
    modal.appendChild(closeButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  };
  
  
  private createGame= () =>{
    this.cellsWrapperElement = document.createElement('div');
    this.cellsWrapperElement.classList.add('cellsWrapper')
    const resetButton = document.createElement('button');
    resetButton.addEventListener("click", () => this.resetGame());
    resetButton.innerText = "Reset Game";
    resetButton.classList.add("btn");
    const scoreButton = document.createElement('button');
    scoreButton.addEventListener('click', () => this.showScores());
    scoreButton.innerText = 'Scores';
    scoreButton.classList.add('btn');
    this.messageElement = document.createElement('span')
    this.messageElement.setAttribute('id', 'message');
    this.messageElement.classList.add('game-announcement')
    this.gameElement.append(this.messageElement,this.cellsWrapperElement,resetButton,scoreButton);
    this.updateGame()

  }

  private updateGame = () =>{

    this.cellsWrapperElement.querySelectorAll(".cell").forEach((cell) => cell.remove());
    this.gameState.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.innerText = value || '';
        cell.addEventListener('click', () => this.handleCellClick(rowIndex, colIndex));
        this.cellsWrapperElement.appendChild(cell);
        if (value === 'X') {
        cell.classList.add('player-x');
        } else if (value === 'O') {
        cell.classList.add('player-o');
        }
      });
    });

    
    const message = document.getElementById('message');
    if (!message) {
      return;
    }
    if (this.gameState.winner === 'draw') {
        message.innerText = 'Match nul!';
      } else if(this.gameState.winner) {
      message.innerText = `Player ${this.gameState.winner} has won the game!`;
      this.saveScore();
    } else {
      message.innerText = `It's player ${this.gameState.currentPlayer}'s turn`;
    }
    
  }
}


export default TicTacToeGame;
