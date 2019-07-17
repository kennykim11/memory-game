
var cards = []
var allColors = ["#800000", "orange", "yellow", "green", "blue", "purple"]
const facedownColor = "grey"

function Card(color, row, column){
    this.faceColor = color
    this.row = row
    this.column = column
    this.isFaceUp = false
    this.canBeFlipped = true
}

Card.prototype.flipColor = function(){
    return (this.isFaceUp = !this.isFaceUp) ? this.faceColor : facedownColor
}

function cardClickHandler(index, event){
    const messageBox = document.getElementById("messages")
    messageBox.innerText = ""
    const dynCardsFlipped = cards.filter(card => card.isFaceUp == true && card.canBeFlipped == true) //get fipped cards that aren't permanant
    if (dynCardsFlipped.length >= 2) {
        dynCardsFlipped.forEach(card => flipByCoord(card.row, card.column, facedownColor))
        return dynCardsFlipped.forEach(card => card.isFaceUp = false); //if 2 cards, flip both back and exit
    }
    if (cards[index].canBeFlipped && !cards[index].isFaceUp) event.target.style.backgroundColor = cards[index].flipColor()
    const matches = cards.filter(card => card.isFaceUp == true && card.canBeFlipped == true && card.faceColor == cards[index].faceColor)
    if (matches.length == 2){ //if 2 cards face up and match
        messageBox.innerText = "You got a pair!"
        matches.forEach(card => card.canBeFlipped = false)
        matches.forEach(card => rotateByCoord(card.row, card.column))
    }
    if (cards.filter(card => !card.isFaceUp).length == 0) messageBox.innerText = "You Won! Press the New Game button to start over!"
}

function flipByCoord(row, column, color){
    document.getElementById("board").children[row].children[column].style.backgroundColor = color
}

function rotateByCoord(row, column){
    document.getElementById("board").children[row].children[column].classList.add("final")
}

function doubleArray(array){
    var concl = []
    for (var i = 0; i < array.length; i++){
        concl.push(array[i], array[i])
    }
    return concl
}

function shuffleCards(cards){
    var concl = []
    while (cards.length != 0){
        concl.push(cards.splice(Math.floor(Math.random() * cards.length), 1)[0])
    }
    return concl
}

function createNewBoard(rows, columns){
    const totalNumOfCards = rows*columns
    if (!(rows >= 1 && columns >= 1)) {
        return document.getElementById("messages").innerText = "Fill both boxes"
    }

    if (totalNumOfCards % 2 == 1) return document.getElementById("messages").innerText = "Number of cards must be even"
    const shuffledColors = shuffleCards(doubleArray(allColors.slice(0, totalNumOfCards / 2)))
    
    const board = document.getElementById("board")
    for (var row = 0; row < rows; row++){
        const rowDiv = document.createElement("div")
        board.appendChild(rowDiv)
        for(var column = 0; column < columns; column++){
            const index = row * columns + column
            cards.push(new Card(shuffledColors[index], row, column))
            const card = document.createElement("span")
            card.style.backgroundColor = "grey"
            card.classList.add("card")
            card.addEventListener("click", cardClickHandler.bind(null, index))
            rowDiv.appendChild(card)
        }
    }
}

function getNewBoardSettings(){
    const board = document.getElementById("board")
    while(board.firstChild) board.removeChild(board.firstChild) //clearing and resetting board
    cards = [] //clearing cards
    document.getElementById("messages").innerText = "Have fun!"
    createNewBoard(+document.getElementById("rows").value, +document.getElementById("columns").value)
}


window.addEventListener("load", function(){
    document.getElementById("newGameButton").addEventListener("click", getNewBoardSettings)
})