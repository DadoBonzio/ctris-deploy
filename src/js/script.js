
$(document).ready(function () {
  init();

  $("#abbandona").on("click", function () {
    window.location.href = "/";
  });

  //partita.html
  // mostraValore();
  newCard();
  setTimeout(() => {
    $(".faccia").hide();
  }, 1000)
  // $(".dorso").css("backface-visibility", "hidden");
  setTimeout(() => {
    $(".faccia").show();
    newCard();
  }, 2000)



  drag();


  var percentuale = 30;
  setInterval(function () {
    var interno = $("#interno");
    interno.css("width", percentuale * (10 / 3) + "%");
    interno.html(percentuale-- + "s");
    if (percentuale < 0) percentuale = 30;
  }, 1000);
}
);


function newCard() {
  var valori = ["1", "-1", "i", "-i"];

  if ($("#carta1").css("display") == "none") {
    var valore = valori[Math.floor(Math.random() * valori.length)];
    var cartaMazzo = $(".carta.faccia");
    $(cartaMazzo).html(valore);
    $("#carta1").html(valore);
    $(".inner").css("transform", "rotateY(-180deg)");
    setTimeout(() => {
      $(".dorso").css("backface-visibility", "visible");
      $(".faccia").hide();
      $("#carta1").show();
    }, 1000)
    $(".faccia").show();
    $(".dorso").css("backface-visibility", "hidden");

  } else if ($("#carta2").css("display") == "none") {
    var valore = valori[Math.floor(Math.random() * valori.length)];
    var cartaMazzo = $(".carta.faccia");
    $(cartaMazzo).html(valore);
    $("#carta2").html(valore);
    $(".inner").css("transform", "rotateY(-180deg)");
    setTimeout(() => {
      $(".dorso").css("backface-visibility", "visible");
      $(".faccia").hide();
      $("#carta2").show();
    }, 1000)
    $(".faccia").show();
    $(".dorso").css("backface-visibility", "hidden");
  }
}




function drag() {

  var carta = $(".tappetino").find(".carta");
  carta.attr("draggable", "true");



  carta.on({

    dragstart: function (e) {
      dropped = false;
      $(this).hide(60);
      dragItem = $(this);
    },
    dragend: function (e) {
      if (!dropped) {
        $(this).show();
      }
      dragItem = null;
    },
  });
  $("td").on({
    dragover: function (e) {
      e.preventDefault();
    },
    dragleave: function (e) {
    },
    dragenter: function (e) {
    },
    drop: function (e) {
      if (!parent.myTurn)
        return;
      // e.preventDefault();
      e.stopImmediatePropagation();
      dropped = true;
      var valStart = $(dragItem).html();
      console.log(`${$(this).html()}`);
      $(this).html(
        regole(`${$(this).html()}`, `${dragItem.html()}`),
      );
      newCard();
      arrayToTable(tableToJson().field);
      var win = checkForWin();
      if (win) {
        parent.log("win!");
      }
      parent.sendMove({ game: parent.game, table: tableToJson().field, win: win });
      parent.changeTurn(false);
      arrayToTable(tableToJson().field);
    },
  });
}
// regole
function regole(primo, secondo) {
  var risultato = 0;
  var regole = {
    uno: [
      ["1", "1"],
      ["&nbsp;", "1"],
      ["-1", "-1"],
      ["i", "-i"],
      ["-i", "i"],
    ],
    _uno: [
      ["-1", "1"],
      ["&nbsp;", "-1"],
      ["1", "-1"],
      ["i", "i"],
      ["-i", "-i"],
    ],
    i: [
      ["1", "i"],
      ["&nbsp;", "i"],
      ["i", "1"],
      ["-i", "-1"],
      ["-1", "-i"],
    ],
    _i: [
      ["-1", "i"],
      ["&nbsp;", "-i"],
      ["i", "-1"],
      ["-i", "1"],
      ["1", "-i"],
    ],
  };
  for (j = 0; j < regole.uno.length; j++) {
    if ([primo, secondo] == `${regole.uno[j]}`) {
      risultato = 1;
      break;
    } else if ([primo, secondo] == `${regole._uno[j]}`) {
      risultato = -1;
      break;
    } else if ([primo, secondo] == `${regole.i[j]}`) {
      risultato = "i";
      break;
    } else if ([primo, secondo] == `${regole._i[j]}`) {
      risultato = "-i";
      break;
    }
  }
  return risultato;
}

function tableToJson() {
  var field = [];
  var rows = $("tr");
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = $("td");
    for (var j = i * 3; j < i * 3 + 3; j++) {
      row.push($(cols[j]).html());
    }
    field.push(row);
  }
  return { field };
}
function arrayToTable(field) {
  $("#campo").empty();
  var table = $("#campo");
  var row, cell;

  body = $("<tbody />");
  table.append(body);

  for (var i = 0; i < field.length; i++) {
    row = $("<tr />");
    table.append(row);
    for (var j = 0; j < field[i].length; j++) {
      cell = $("<td>" + field[i][j] + "</td>");
      row.append(cell);
    }
  }
  drag();
}


function checkForWin() {
  var field = tableToJson().field;

  for (var i = 0; i < field.length; i++) {
    if ((field[i][0] == parent.yourchar && (field[i][0] == field[i][1] && field[i][1] == field[i][2]))
      || (field[0][i] == parent.yourchar && (field[0][i] == field[1][i] && field[1][i] == field[2][i]))) { return true; }
  }
  if ((field[0][0] == parent.yourchar && (field[0][0] == field[1][1] && field[1][1] == field[2][2]))
    || ((field[0][2] == field[1][1] && field[1][1] == field[2][0]) && field[0][2] == parent.yourchar)) { return true; }

  return false;
}

function init() {
  parent.changeTurn(parent.myTurn);
  if (parent.game == null) {
    parent.log("Enter game code first!");
    parent.loadLobby();
    return;
  }

  const players = [];
  for (let i = 0; i < parent.game.p.length; i++) {
    players.push(parent.game.p[i]);
  }

  const index = players.indexOf(parent.id);
  if (index > -1) { // only splice array when item is found
    players.splice(index, 1); // 2nd parameter means remove one item only
  }


  document.getElementById('matchCode').innerText = "Match Code: " + parent.game.code;
  document.getElementById('yourId').innerText = "Your Id: " + parent.id;
  document.getElementById('opponentId').innerText = "Playing against: " + players[0];
  document.getElementById('trisDisplayer').innerText = "You have to make a tris of: " + parent.yourchar;
  document.getElementById('oppTrisDisplayer').innerText = "Your opponent has to make a tris of: " + parent.opponentchar;
}

