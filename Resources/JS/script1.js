
// create redips container
let redips = {};

// redips initialization
redips.init = function () {
	let rd = REDIPS.drag;
	rd.init();
	rd.hover.colorTd = '#9BB3DA';
	rd.dropMode = 'single';
	addRestriction();
	loadContent();
};
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}

//to-do after dropping rewards
REDIPS.drag.event.dropped = function () {
	var pos = REDIPS.drag.getPosition();
	 if(pos[0]==pos[3]&&pos[1]==pos[4]&&pos[2]==pos[5])
		 return;
	 updateUndo();	
	 redoStack=[];
	 saveContent();
 };

 //removes cross in the rewards
 function addCross(){
	var elements=document.getElementsByClassName("redips-drag");
	
	for(var i=0;i< elements.length; i++)
	{
		if(elements[i].childElementCount==0)
		{
			var span=document.getElementsByClassName("cross")[0].cloneNode(true);
			elements[i].appendChild(span);
			
		}
	}
}
//allows only rewards in their respective row
function addRestriction(){
	REDIPS.drag.only.divClass.reward1 = 'reward1';
	REDIPS.drag.only.divClass.reward2 = 'reward2';
	REDIPS.drag.only.divClass.reward3 = 'reward3';
	REDIPS.drag.only.divClass.reward4 = 'reward4';
	REDIPS.drag.only.divClass.reward5 = 'reward5';
}

//removes rewards from the board
function crossClick(element){
	
	var parent=element.parentElement.parentElement;
	var no=parent.innerHTML.split(" ")[1];
	var pos=REDIPS.drag.getPosition(parent);
	if(pos[0]==0)
	return;
	undoStack.push( parent);
	var array=[0,parseInt(no)+1,0,pos[0],pos[1],pos[2]];
	undoStack.push(array);
	parent.remove();
	saveContent();
	
	
};

//load content from the stored state
function loadContent(){
	var content=localStorage.getItem("storedPosition");
	
	
	if(content!=="")
	{
		document.getElementsByClassName("alert")[0].style.display = "block";
		REDIPS.drag.loadContent("table2",content);
		addCross();
	}
	else{
		document.getElementsByClassName("alert")[0].innerHTML = "Note: Your board state will be automatically stored in the local storage. It will be loaded when you revisit the link.";
	}
	
}

function redo(){
	if(redoStack.length==0)
	return;
 var dest=	redoStack.pop();
 var obj= redoStack.pop();
 
 undoStack.push(obj);
 undoStack.push(dest);
 
 if(dest[0]==0)
 {
	 obj.remove();
 }
 else{
	REDIPS.drag.moveObject({
	
		target: dest.slice(0,3),
		obj: obj
	});

}
saveContent();
}


function reset(){
	REDIPS.drag.clearTable("table2");
	undoStack=[];
	redoStack=[];
	saveContent();
}

//ssave the content
function saveContent(){
	localStorage.setItem("storedPosition", REDIPS.drag.saveContent("table2","json"));
}

let undoStack=[];
let redoStack=[];

function updateUndo(){
	undoStack.push( REDIPS.drag.obj);
	undoStack.push(REDIPS.drag.getPosition());
	
}

function undo(){

	if(undoStack.length==0)
	return;
  var dest=	undoStack.pop();
  var obj= undoStack.pop();
redoStack.push(obj);
redoStack.push(dest);

 if(dest[3]==0)
 {
	 obj.remove();
 }
 else{
	REDIPS.drag.moveObject({
	
		target: dest.slice(3,6),
		obj: obj
	});

}
}


