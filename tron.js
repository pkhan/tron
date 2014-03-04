$(function(){
    var gridLength = 51; //cells
    var cellSize = 11; //px

    var styles = $('<style type="text/css">.cell{ height: ' + (cellSize-1) + 'px; width: ' + (cellSize-1) + 'px}</style>');

    var grid = $('<div class="grid"></div>');

    grid.css("width", (gridLength*cellSize)+"px");
    grid.css("height", (gridLength*cellSize)+"px");

    for(var i=0; i<gridLength; i++){
      for(var j=0; j<gridLength; j++){

        //get rid of this part BEGIN
        if(i === 1){
          grid.append('<div class="cell tron1 path"></div>');
        }else if(i === 4){
          grid.append('<div class="cell tron2 path"></div>');
        }else if(i === 9){
          grid.append('<div class="cell tron3 path"></div>');
        }else if(i === 11){
          grid.append('<div class="cell tron4 path"></div>');
        } else {
        // END
        
          grid.append('<div class="cell"></div>');
        }
      }
    }
    $('body').append(grid).append(styles);
});