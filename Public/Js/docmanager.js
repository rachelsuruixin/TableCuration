

function addChange(doList){
    /*
    format of changeList['setList']
    [table_id,row_col,value,cellType]
    table_id : 0,1,2,... (the table index in xmlfile of path2)
    row_col  : [row, col]
    cellType : 1,2,3
    
    format of changeList['mergeList']
    [table_id,merge_demerge,row_col,rectange]
    merge_demerge : 0(demerge), 1(merge)
    */
    var changeList={'setList':[],'mergeList':[]};
    for (var i in doList){
        // commands in doList
        for (var j in doList[i]){
            //command in commands
            var command = doList[i][j];
            if (command['type']=='deleteCell'){
                var cell=command['param'][0];
                changeList['setList'].push([tb_show_id,cell.row_col,'',cell.cellType]);
            }else if(command['type']=='setCell'){
                var param = command['param'];
                changeList['setList'].push([tb_show_id,param[1],param[2],param[3]]);
            }else if(command['type']=='merge'){
                var param = command['param'];
                changeList['mergeList'].push([tb_show_id,1,param[1],param[2]]);
            }else if(command['type']=='demerge'){
                var param = command['param'];
                changeList['mergeList'].push([tb_show_id,0,param[1]]);
            }
        }
    }
    return changeList;
    
}

function parseChangelist(changeList){
    var postList={'setList':{},'mergeList':{}};
    for (var i=0;i<tb_max;i++){
        postList['setList'][i]=[];
        postList['mergeList'][i]=[];
    }
    for (var j in changeList['setList']){
        command=changeList['setList'][j];
        postList['setList'][command[0]].push([command[1][0],command[1][1],command[2]]);
    }
    for (var j in changeList['mergeList']){
        
        command=changeList['mergeList'][j];
        if(command[1]==1)
            postList['mergeList'][command[0]].push([command[1],command[2][0],command[2][1],command[3][0],command[3][1]]);
        else{
            postList['mergeList'][command[0]].push([command[1],command[2][0],command[2][1]]);
        }
    }
    return postList
    
       
}
function saveTable(){
    var path2=prompt("The name to save. If empty, it will cover the original file");
    if(path2==null){
        return false;
    }
    var newDoList=[];
    if(doFlag!=-1){
        for (var i=0;i<doFlag;i++){
            newDoList.push(doList[i]);
        }
    }else{
        newDoList=doList;
    }
    var changeList=addChange(newDoList);
    $('#saveMsg').html('<span class="label label-info">Uploading...</span>');
    
    var args=getArgs();
    if (path2==''){
        path2=args['path2'];
    }
    var postList = parseChangelist(changeList);
// in args(the editor page, the changed file was path2, but in update page, the changed file is path1 and the after improved file is path2
    $.post('/index.php/Home/Index/updatexml.html?path1='+args['path2']+'&path2='+path2,postList,function(data){
        $('#saveMsg').html(data);
        return true;
        if(data=='success'){
            $('#saveMsg').html('<span class="label label-success">Success</span>');
        }
        else{$('#saveMsg').html('<span class="label label-danger">Failed</span>')}
        
    },'TEXT');
}

function getArgs(){
    var args=new Object();
    var query=location.search.substring(1);//获取查询串
    var pairs=query.split("&");//在&处断开
    for(var i=0;i<pairs.length;i++)
    {
    var pos=pairs[i].indexOf('=');//查找name=value
    if(pos==-1) continue;//如果没有找到就跳过
    var argname=pairs[i].substring(0,pos);//提取name
    var value=pairs[i].substring(pos+1);//提取value
    args[argname]=unescape(value);//存为属性
    }
    return args;//返回对象
} 
