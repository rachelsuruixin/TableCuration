//set some global variables
var rownum=4,colnum=4,selectedCells=[],allCells=[],undoList=[],doList=[],doFlag=-1;
var selectedPosition,selectedRectangle,selectedCell,startCell,endCell,table;
var metaKey=false;
var colCode={0:'A',1:'B',2:'C',3:'D',4:'E',5:'F',6:'G',7:'H'};
//add rows and cells
function multiunittable_init(tableid,row_col){
    var allCells=[]
    focus_tableid=tableid;
	table=document.getElementById(tableid);
	table.innerHTML="";
	rownum = row_col[0];
	colnum = row_col[1];
	for (var i=0;i<rownum;i++){
    	row = table.insertRow(i);
    	var cells_in_row = [];
        //var row = table.rows[-1];
        for(var j=0;j<colnum;j++){
					cell = row.insertCell(-1);
					decorateCell(cell,[i,j]);
					cells_in_row.push(cell);
		}
		allCells.push(cells_in_row);
	}
	var row=table.createTHead().insertRow();
	for(var j=0;j<colnum;j++){
		var a = document.createElement("th");
			a.innerHTML=colCode[j];
  		row.appendChild(a);
	}
	table=table.tBodies[0];
	table.allCells=allCells;
	return table
}
/**
 *method merge_cell
 *param object table the table in the document
 *param arraylist<number> startPoint [i,j]
 *param arraylist<number> rectangle  [rowSpan,colSpan]
 */
function merge_cell(table,startPoint,rectangle){
	//var cell=getCell(table,startPoint);
	var cell=table.allCells[startPoint[0]][startPoint[1]];
	cell.rowSpan=rectangle[0];
	cell.colSpan=rectangle[1];  
    //delete the rest cells
	 
	for(var i=startPoint[0];i<rectangle[0]+startPoint[0];i++){
		row=table.rows[i];
		if (i==startPoint[0]){
			for(var j=startPoint[1]+1;j<rectangle[1]+startPoint[1];j++){
				for(var k=0;k<=startPoint[1]+1;k++){
					if(row.cells[k].row_col[1]==j){
						if(row.cells[k].innerHTML!=''){
							setCell(table,[startPoint[0],startPoint[1]],cell.innerHTML+'</br>'+row.cells[k].innerHTML,cell.cellType);
						}
						row.deleteCell(k);
						break;
					}
				}
			}
		}
		else if(i!=startPoint[0]){
			for (var j=startPoint[1];j<rectangle[1]+startPoint[1];j++){
				for(var k=0;k<=startPoint[1];k++){
					if(row.cells[k].row_col[1]==j){
						if(row.cells[k].innerHTML!=''){
							setCell(table,[startPoint[0],startPoint[1]],cell.innerHTML+'</br>'+row.cells[k].innerHTML,cell.cellType);
						}
						row.deleteCell(k);
						break;
					}
				}
			}
		}
	}
}
function demerge_cell(table,startPoint){
	var cell=getCell(table,startPoint);  
	var colSpan=1;
	if(cell.colSpan!=undefined) colSpan=cell.colSpan;
	for (var i=startPoint[0];i<cell.rowSpan+startPoint[0];i++){
		row=table.rows[i];
		if (i==startPoint[0]){
			for(var j=startPoint[1]+1;j<cell.colSpan+startPoint[1];j++){
				for(var k=0;k<=j;k++){
					if(row.cells[k]==undefined || (row.cells[k].row_col[1]>j)){  
						cell1=row.insertCell(k);
						decorateCell(cell1,[i,j]);
						setCell(table,[i,j],cell.innerHTML,cell.cellType);
						table.allCells[i][j]=cell1;
						break;
					}
				}
			}
		}else{
			for(var j=startPoint[1];j<cell.colSpan+startPoint[1];j++){
				for(var k=0;k<=j;k++){
					if(row.cells[k]==undefined || row.cells[k].row_col[1]>j){ 
						cell1=row.insertCell(k);
						decorateCell(cell1,[i,j]);
						setCell(table,[i,j],cell.innerHTML,cell.cellType);
						table.allCells[i][j]=cell1;
						break;
					}
					
				}
			}
			
		}
	}
	cell.rowSpan=0;cell.colSpan=0;
}
/**
 *method pointToRectangle
 *param startPoint
 *param endPoint
 */
function pointToRectangle(startPoint,endPoint){
	var position=[Math.min(startPoint[0],endPoint[0]),Math.min(startPoint[1],endPoint[1])];
	var rectangle=[Math.abs(startPoint[0]-endPoint[0])+1,Math.abs(startPoint[1]-endPoint[1])+1];
	return [position,rectangle]
}
/**
 *method mergeBySelect
 *get startPoint and endPoint from global variables
 */
function mergeBySelected(){
	if (selectedPosition.length>0 && !(selectedRectangle[0]==1 && selectedRectangle[1]==1)){
    	var command=[],undocommand=[];
    	command.push({'type':'merge','param':[table,selectedPosition,selectedRectangle]});
    	undocommand.push({'type':'demerge','param':[table,selectedPosition]});
    	for(var i=selectedPosition[0];i<selectedPosition[0]+selectedRectangle[0];i++){
    	    for(var j=selectedPosition[1];j<selectedPosition[1]+selectedRectangle[1];j++){
    	        var cell=table.allCells[i][j];
    	        undocommand.push({'type':'setCell','param':[table,[i,j],cell.innerHTML,cell.cellType]});
    	        //check whether it can be merged
    	        if(cell.rowSpan>1||cell.colSpan>1){
    	            alert('Error, cannot merge cells that have been merged. please demerge them first!')
    	            return false;
    	        }
    	    }
    	}
    	merge_cell(table,selectedPosition,selectedRectangle);
    	refreshTableBorder(table);
    	CellSelected(getCell(table,selectedPosition));
    	selectedPosition=null;
    	selectedRectangle=null;
    	if(command.length!=0){
    	    addUndoList(command,undocommand);
    	}
	}else{
	    //to debug
	}
}
function demergeBySelected(){
	if(selectedCell && !(selectedCell.rowSpan==1 &&selectedCell.colSpan==1)){
	    var command=[],undocommand=[];
	    undocommand.push({'type':'merge','param':[table,selectedCell.row_col,[selectedCell.rowSpan,selectedCell.colSpan]]});
	    undocommand.push({'type':'setCell','param':[table,selectedCell.row_col,selectedCell.innerHTML,selectedCell.cellType]});
	    command.push({'type':'demerge','param':[table,selectedCell.row_col]});
		demerge_cell(table,selectedCell.row_col);
		addUndoList(command,undocommand);
	}
}
//Cells manipulation
/**
 *method getCell
 *param arraylist<number> cellPoint [i,j]
 *return object cell the cell in the document
 */
function getCell(table,cellPoint){
	return table.rows[cellPoint[0]].cells[cellPoint[1]];
}
function setCell(table,cellPoint,value,cellType){
	var cell = getCell(table,cellPoint);
	if(value){
		cell.innerHTML=value;}
	if(cellType){
		cell.cellType=cellType;
		renderCell(cell);
	}
	return 
	
}
function renderCell(cell){
	if (!cell.hasOwnProperty('cellType')){
		return 0;
	}
	if (cell.className.match('selected')){
		cell.style.cssText="";
		return 0;
	}
	var	cellType=cell.cellType;
	switch(cellType){
		case 1:
			cell.style.cssText="background-color:Orange";
			break;
		case 2:
			cell.style.cssText="background-color:#F0DBDB";
			break;
		case 3:
			cell.style.cssText="background-color:yellow";				
			break;
		case 4:
	}
}
function bt_splitCell(){
	var cell=selectedCell;
	var x = parseInt($("input[name='splitX']").val());
	var y = parseInt($("input[name='splitY']").val());
	if(cell!=undefined){
		splitCell(table,cell.row_col,[x,y]);
	}
}
function splitCell(table,cellPoint,rectangle){
    if(!confirm('This function is deprecated, because it cannot be saved and undone. Are you sure to split the cell?'))
        return false
	var cell=table.allCells[cellPoint[0]][cellPoint[1]];
	var x=rectangle[0];
	var y=rectangle[1];
	// add row and col
	for(var i=cellPoint[0]+1;i<cellPoint[0]+rectangle[0];i++){
		addRow(table,i);
	}
	for (var j=cellPoint[1]+1;j<cellPoint[1]+rectangle[1];j++){
		addCol(table,j);
	}
	// add text
	/*
	 *if it is needed that the added cells should be the same as the selected cell,
	  	uncomment the following codes

	for (var i=cellPoint[0];i<cellPoint[0]+rectangle[0];i++){
		for(var j=cellPoint[1];j<cellPoint[1]+rectangle[1];j++){
			setCell(table,[i,j],cell.innerHTML,cell.cellType);
		}
	}
	*/
	// merge
	for(var i=0;i<cellPoint[0];i++){
		merge_cell(table,[i,cellPoint[1]],[1,rectangle[1]]);
	}
	for(var i=cellPoint[0]+rectangle[0];i<rownum;i++){
		merge_cell(table,[i,cellPoint[1]],[1,rectangle[1]]);
	} 
	for(var j=0;j<cellPoint[1];j++){
		merge_cell(table,[cellPoint[0],j],[rectangle[0],1]);
	}
	for(var j=cellPoint[1]+rectangle[1];j<colnum;j++){
		merge_cell(table,[cellPoint[0],j],[rectangle[0],1]);
	}

}
//Table manipulation
function bt_addRow(meta){
	var cell=selectedCell;
	if(cell!=undefined){
		var position=cell.row_col[0]+meta;
		addRow(table,position);
	}
}
function addRow(table,position){
	
	var newrow=	table.insertRow(position);
	table.allCells.splice(position,0,[]);
	for(var i =0;i<colnum;i++){
		var cell=newrow.insertCell(-1);
		cell.innerHTML=position;
		decorateCell(cell,[position,i]);
		table.allCells[position].push(cell);
	}
	rownum++;
	debug('position'+position);
	for(var i=position+1;i<rownum;i++){
		for(var j=0;j<colnum;j++){
			cell=table.allCells[i][j];
			//debug(cell.innerHTML);
			cell.row_col=[i,j];
			//cell.innerHTML=i;
		}
	}
}
function bt_addCol(meta){
	var cell=selectedCell;
	if(cell!=undefined){
		var position=cell.row_col[1]+meta;
		addCol(table,position);
	}
}
function addCol(table,position){
	//add head
	colnum++;
	headrow=table.parentNode.tHead.rows[0];
	headrow.insertCell(position);
	for(var j=0;j<colnum;j++){
		headrow.cells[j].innerHTML=colCode[j];
	}
	for(var i=0;i<rownum;i++){
		var row=table.rows[i];
		var newcell=row.insertCell(position);
		decorateCell(newcell,[i,position]);
		table.allCells[i].splice(position,0,newcell);
		for (var j=position+1;j<colnum;j++){
			table.allCells[i][j].row_col=[i,j];
		}
	}
}
function ClearChild(element){  
element.innerHTML = "";  
} 
//设置被选择后效果
function CellSelected(element){
//	element.style.BorderColor="FF0000";
	element.style.border="solid 2px black";
	if(selectedCell)
		CellDeSelect(selectedCell);
	selectedCell=element;
}
function CellDeSelect(element){
	element.style.border="";
}
//多选效果
function CellMultiSelect(startCell,endCell){
	//var table = startCell.parentNode.parentNode.parentNode;
	//console.log(startRow_Col);
	//console.log(endPoint);
	for (i=Math.min(startCell.row_col[0],endCell.row_col[0]);i<=Math.max(startCell.row_col[0],endCell.row_col[0]);i++){
		for(j=Math.min(startCell.row_col[1],endCell.row_col[1]);j<=Math.max(startCell.row_col[1],endCell.row_col[1]);j++){
		//	table.rows[i].cells[j].className="selected"
		//	renderCell(table.rows[i].cells[j]);
		var cell = startCell.parentNode.parentNode.allCells[i][j];
		cell.className="selected";
		renderCell(cell);
			
		}
	}
}
//重置border效果
function refreshTableBorder(element) {
	var tcell;
	for (var i=0;i<element.rows.length;i++){
		row=element.rows[i]
		for (var j=0;j<row.cells.length;j++){
			tcell = row.cells[j];
			tcell.className=tcell.className.replace('selected','');
			tcell.style.border="";
			renderCell(tcell);
		}
	}
	
}
//设置指定单元格可编辑
function EditCell(element){  
  CreateTextBox(element,element.innerHTML);
}  
function CreateTextBox(element, value){  
//检查编辑状态，如果已经是编辑状态，跳过  
	var editState = element.getAttribute("EditState");
	if(editState != "true"){  
		 //创建文本框  
		 var textBox = document.createElement("INPUT");  
		 textBox.type = "text";  
		 textBox.className="EditCell_TextBox";
		 //textBox.style.width=element.clientWidth+"px";
		 textBox.style.width='100%';
		 textBox.style.height=element.clientHeight+"px";
		 element.className="edit";
		 //设置文本框当前值  
		 if(!value){
			value = element.getAttribute("Value");  
		 }    
		 textBox.value = value;  
			
		 //设置文本框的失去焦点事件  
		 textBox.onblur = function (){  
			CancelEditCell(this.parentNode, this.value);  
		 }  
		 //向当前单元格添加文本框  
		 ClearChild(element);
		 
		 element.appendChild(textBox);  
		 textBox.focus();  
		 textBox.select();  
			
		 //改变状态变量  
		 element.setAttribute("EditState", "true");  
		 element.parentNode.parentNode.setAttribute("CurrentRow", element.parentNode.rowIndex);  
	}   
}		
//取消单元格编辑状态  
function CancelEditCell(element, value, text){  
element.setAttribute("Value", value);  
if(text){  
   element.innerHTML = text;  
}else{  
   element.innerHTML = value;  
}  
element.setAttribute("EditState", "false"); 
element.className=element.className.replace('edit','');
  
//检查是否有公式计算  
//CheckExpression(element.parentNode);  
}  
function bt_changeCell(){
	var cell = selectedCell;
	if (cell == undefined){
		if (selectedPosition){
			formCellType.content.value='';
			formCellType.style.display='block';
		}
		else{
		return 0;
		}
	}else{
		if(cell.hasOwnProperty('cellType'))
		{
			$("input:radio[name='radio_cellType']").eq(cell.cellType-1).attr('checked',true);
		}
		formCellType.content.value=cell.innerHTML;
		formCellType.style.display='block';
		}
}
function saveCellType(){
	var cell = selectedCell;
    cellType=$("input:radio[name='radio_cellType']:checked").val();
	cellType=parseInt(cellType);
	var text='';
	var command=[];
	var undocommand=[];
	if (formCellType.content.value){
		text=formCellType.content.value;
	}
	if(cell!=undefined){
	    //check whether changed:
	    if((text==''||text==cell.innerHTML) && cell.cellType==cellType){
	        debug('not changed of cell');
	    }else{
		command.push({'type':'setCell','param':[table,cell.row_col,text ? text : cell.innerHTML,cellType]});
		undocommand.push({'type':'setCell','param':[table,cell.row_col,cell.innerHTML,cell.cellType]});
		setCell(table,cell.row_col,text ? text : cell.innerHTML,cellType);
	    }
	}
	if (selectedPosition && selectedRectangle){
		selectedCells.push([selectedPosition,selectedRectangle]);
	}
	for (var k in selectedCells){
		selectedPosition=selectedCells[k][0];
		selectedRectangle=selectedCells[k][1];
		for(var i=selectedPosition[0];i<selectedRectangle[0]+selectedPosition[0];i++){
			for (var j = selectedPosition[1];j<selectedRectangle[1]+selectedPosition[1];j++){
				cell = getCell(table,[i,j]);
				if(text!='' || cell.cellType!=cellType){
    				command.push({'type':'setCell','param':[table,cell.row_col,text ? text : cell.innerHTML,cellType]});
    				undocommand.push({'type':'setCell','param':[table,cell.row_col,cell.innerHTML,cell.cellType]});
    				setCell(table,cell.row_col, text ? text : cell.innerHTML,cellType);
				}
			}
		}
	}
	formCellType.style.display='none';
	if(command.length!=0){
	    addUndoList(command,undocommand);
	}
}
function cancelCellType(){
	formCellType.style.display='none';
}
function deleteCell(cell){
	if(cell==undefined)
		return false;
	cell.innerHTML='';
}
function bt_deleteCell(){
	var cell=selectedCell;
	var command=[],undocommand=[];
	if (cell!=undefined){
	    command.push({'type':'deleteCell','param':[cell]});
	    undocommand.push({'type':'setCell','param':[table,cell.row_col,cell.innerHTML,cell.cellType]});
		deleteCell(cell);
	}
	if (selectedPosition && selectedRectangle){
		selectedCells.push([selectedPosition,selectedRectangle]);
	}
	for (var k in selectedCells){
		selectedPosition=selectedCells[k][0];
		selectedRectangle=selectedCells[k][1];
		for(var i=selectedPosition[0];i<selectedRectangle[0]+selectedPosition[0];i++){
			for (var j = selectedPosition[1];j<selectedRectangle[1]+selectedPosition[1];j++){
				cell = getCell(table,[i,j]);
				command.push({'type':'deleteCell','param':[cell]});
				undocommand.push({'type':'setCell','param':[table,cell.row_col,cell.innerHTML,cell.cellType]});
				deleteCell(cell);
			
			}
		}
	}
	addUndoList(command,undocommand);
}
function bt_redo(){
	if(doFlag==-1){
		return false;
	}else{
		var commands = doList[doFlag];
		doFlag++;
		for(var i in commands){
			execute(commands[i]);
		}
		if(doFlag==doList.length){
			document.getElementById("bt_redo").disabled=true;
		}
		document.getElementById("bt_undo").disabled=false;
	}
}
function bt_undo(){
	if(doFlag==-1){
		doFlag=undoList.length;
	}else if(doFlag==0){
		return false;
	}
	var commands = undoList[doFlag-1];
	doFlag--;
	for (var i in commands){
		execute(commands[i]);
	}
	if(doFlag==0){
		document.getElementById("bt_undo").disabled=true;
	}
	document.getElementById("bt_redo").disabled=false;
}
function addUndoList(command,undocommand){
	if (doFlag!=-1){
		var newDoList=[],newUndoList=[];
		for(var i=0;i<doFlag;i++){
			newDoList.push(doList[i]);
			newUndoList.push(undoList[i]);
		}
		doList=newDoList;
		undoList=newUndoList;
		doList.push(command);
		undoList.push(undocommand);
	}else{
	  doList.push(command);
	  undoList.push(undocommand);
	}
	doFlag=-1;
	document.getElementById("bt_undo").disabled=false;
}
function execute(commandLine){
    var funcs = {'setCell':setCell,'deleteCell':deleteCell,'merge':merge_cell,'demerge':demerge_cell};
    var cmd = commandLine['type'];
    var param = commandLine['param'];
    funcs[cmd].apply(this,param);
}
/**
 *class decorateCell
 *param row thicy the cell is insered into
 *param index the same param as inserCell
 */
function decorateCell(cell,cellPoint){
	cell.row_col=cellPoint;
  cell.width=40;
	cell.onclick=function(e){
		if (e.metaKey){
			selectedPosition = cell.row_col;
			selectedRectangle=[1,1];
			selectedCells.push([selectedPosition,selectedRectangle]);
			cell.className='selected';
			renderCell(cell);
			
		}else{
			selectedCells=[];
			selectedPosition=[];
			selectedRectangle=[];
			refreshTableBorder(cell.parentNode.parentNode);
			if (selectedCell!=cell){
				CellSelected(cell);
			}
		}
		
	};
	cell.onmousedown = function(e){
		if (this.getAttribute("EditState"))
			return 0;
		if (e.metaKey){
			if(selectedPosition && selectedRectangle){
				selectedCells.push([selectedPosition,selectedRectangle]);
			}
			if(selectedCell&&cell!=selectedCell){
				selectedCells.push([selectedCell.row_col,[1,1]]);
			}
			metaKey=true;
		}else{
			metaKey=false;
			selectedCells=[];
		}
		startCell=this;

	};
	cell.onmouseup = function(){
		if(startCell && endCell){
			a=pointToRectangle(startCell.row_col,endCell.row_col);
			selectedPosition = a[0];
			selectedRectangle=a[1];
			if(!metaKey){
				selectedCell=null;
			}
		}
		startCell=null;
		endCell=null;
		metaKey=false;
	};	
	cell.onmouseover = function(){
		if(startCell)
		{
			if(!metaKey)
				refreshTableBorder(cell.parentNode.parentNode);
			endCell=this;
			CellMultiSelect(startCell,endCell);
		}
	};
	cell.ondblclick = function(){
	    //the function has been cannceled temperally.
	//	EditCell(this);
	};
}
function decorateHeadCell(cell,j){
	cell.col=j;
  cell.width=40;
}
function decorateTheadCell(cell,cellPoint){
	cell.row_col=cellPoint;
  cell.width=40;
}
//************global**********
document.onselectstart = function() {
return false;
};
document.onclick = function(event){
}
function debug(content){
	document.getElementById('debug').innerHTML+=content;
}
