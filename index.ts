function validateBattlefield(field) {
  //Check total length
  if (field.length !== 10 || field.some((row) => row.length !== 10)) {
    return false;
  }

  //Create ship array
  const shipsArray = getShipArray(field);

  //Check total number of 1's
  if (shipsArray.length !== 20) {
    return false;
  }

  //The ships I have
  let battleship = 1; // 4 ships
  let cruisers = 2; // 3 ships
  let destroyers = 3; // 2 ships
  let submarines = 4; // 1 ship

  while (shipsArray.length > 0) {
    let count = 1; //It starts with one ship
    let currentPos = shipsArray[0]; // Get the first position

    // Step 1: Check for diagonals
    if (isShipDiagonal(shipsArray, currentPos)) {
      return false;
    }

    //Step 2: Check for horizontal
    if (isShipHorizontal(shipsArray, currentPos)) {
      while (isShipHorizontal(shipsArray, currentPos)) {
        //Check that the next one doesn't have vertical or diagonal
        if (
          isShipDiagonal(shipsArray, currentPos) ||
          isShipVertical(shipsArray, currentPos)
        ) {
          return false;
        }
        currentPos.col++;
        count++;
      }
      // Update ship counters based on size
      if (count === 4) battleship--;
      else if (count === 3) cruisers--;
      else if (count === 2) destroyers--;
      else submarines--;

      // Remove all the horizontal ship parts
      removeShipParts(shipsArray, currentPos.row, currentPos.col, count, true);
    }

    //Step 3: Check for vertical
    if (isShipVertical(shipsArray, currentPos)) {
      while (isShipVertical(shipsArray, currentPos)) {
        //Check that the next one doesn't have horizontal or diagonal
        if (
          isShipDiagonal(shipsArray, currentPos) ||
          isShipHorizontal(shipsArray, currentPos)
        ) {
          return false;
        }
        currentPos.row++;
        count++;
      }
      // Update ship counters based on size
      if (count === 4) battleship--;
      else if (count === 3) cruisers--;
      else if (count === 2) destroyers--;
      else submarines--;

      // Remove all the vertical ship parts
      removeShipParts(shipsArray, currentPos.row, currentPos.col, count, false);
    }

    // Step 4: Handle submarines (single ship parts)
    else {
      submarines--;
      shipsArray.shift();
    }
  }

  //TODO: Fix and check for all ship types
  if (battleship < 0) {
    return false;
  }

  return true;
}

//To create the array of shipPositions
// returns an array with the object {row:number, col: number}
function getShipArray(field) {
  let positions = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (field[row][col] === 1) {
        positions.push({ row: row, col: col });
      }
    }
  }
  return positions;
}

//To check if there is not any ship on the diagonal
//It will return true if it finds the ship of current position
//has a diagonal on the shipsArray
function isShipDiagonal(positions, currentPosition) {
  if (currentPosition.row === 9) {
    return false;
  } else if (currentPosition.col === 0) {
    return positions.some(
      (pos) =>
        pos.row === currentPosition.row + 1 &&
        pos.col === currentPosition.col + 1
    );
  } else if (currentPosition.row === 0 && currentPosition.col === 9) {
    return positions.some(
      (pos) =>
        pos.row === currentPosition.row + 1 &&
        pos.col === currentPosition.col - 1
    );
  } else {
    return positions.some(
      (pos) =>
        (pos.row === currentPosition.row + 1 &&
          pos.col === currentPosition.col + 1) ||
        (pos.row === currentPosition.row + 1 &&
          pos.col === currentPosition.col - 1)
    );
  }
}

//To check if there is a ship horizontaly. It will boolean
function isShipHorizontal(positions, currentPosition) {
  if (currentPosition.col === 9) {
    return false;
  } else {
    return positions.some(
      (pos) =>
        pos.col === currentPosition.col + 1 && pos.row === currentPosition.row
    );
  }
}

//To check if there is a ship vertically. It will boolean
function isShipVertical(positions, currentPosition) {
  if (currentPosition.row === 9) {
    return false;
  } else {
    return positions.some(
      (pos) =>
        pos.row === currentPosition.row + 1 && pos.col === currentPosition.col
    );
  }
}

//To remove the corresponding ships (either horizontally or vertically)
function removeShipParts(positions, row, col, length, isHorizontal) {
  // Remove the parts of the ship (either horizontally or vertically)
  for (let i = 0; i < length; i++) {
    let index;
    if (isHorizontal) {
      index = positions.findIndex(
        (pos) => pos.row === row && pos.col === col + i
      );
    } else {
      index = positions.findIndex(
        (pos) => pos.row === row + i && pos.col === col
      );
    }
    if (index !== -1) positions.splice(index, 1); // Remove ship
  }
}
