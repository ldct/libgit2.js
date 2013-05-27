var drag_target = null;

function drag_start(event) {
    //console.log("dragstart fired with", this.id);
    drag_target = this.id;
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
} 
function drag_over(event) { 
    event.preventDefault(); 
    return false; 
}
function clamp(n) {
  return n > 0 ? n : 0;
}
function make_drop(target) {
    return function() {
        if (target != drag_target) {
            return false;
        }
        var offset = event.dataTransfer.getData("text/plain").split(',');
        var dm = document.getElementById(target);
        dm.style.left = clamp(event.clientX + parseInt(offset[0],10)) + 'px';
        dm.style.top = clamp(event.clientY + parseInt(offset[1],10)) + 'px';
        event.preventDefault();
        return false;
    }    
} 

function make_draggable(target) {
    var dm = document.getElementById(target); 
    dm.addEventListener('dragstart',drag_start,false); 
    document.body.addEventListener('dragover',drag_over,false); 
    document.body.addEventListener('drop',make_drop(target),false);
}

make_draggable("terminal_drag");
make_draggable("explorer_drag");