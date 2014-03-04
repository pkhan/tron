$(function(){
    var gridLength = 60; //cells
    var cellSize = 8; //px

    var styles = $('<style type="text/css">.cell{ height: ' + (cellSize-1) + 'px; width: ' + (cellSize-1) + 'px}</style>');

    var grid = $('<div class="grid"></div>');

    grid.css("width", (gridLength*cellSize)+"px");
    grid.css("height", (gridLength*cellSize)+"px");

    for(var i=0; i<gridLength; i++){
      for(var j=0; j<gridLength; j++){

        //get rid of this part: placeholder tron paths BEGIN =============================
        if(i === 34 && j >= 11){
          if (j != 11){
          grid.append('<div class="cell tron1"></div>');
          } else {
            grid.append('<div class="cell tron1 bike"></div>');
          }
        }else if(i === 4 && j <= 32){
          if (j != 32){
          grid.append('<div class="cell tron2"></div>');
          } else {
            grid.append('<div class="cell tron2 bike"></div>');
          }
        }else if(i === 9 && j >= 3){
          if (j != 3){
          grid.append('<div class="cell tron3"></div>');
          } else {
            grid.append('<div class="cell tron3 bike"></div>');
          }
        }else if(i === 20 && j <=28){
          if (j != 28){
          grid.append('<div class="cell tron4"></div>');
          } else {
            grid.append('<div class="cell tron4 bike"></div>');
          }
        } else {
        // END =============================================================================

          grid.append('<div class="cell"></div>');
        }
      }
    }
    $('body').append(grid).append(styles);
});