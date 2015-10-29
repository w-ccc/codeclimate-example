var chess_grid = new Array;
var chess_grid_status = new Array;//值为1代表生，值为0代表死，值为2代表墙壁
var chess_grid_old_status = new Array;
var chess_row_number = 50;
var life_color = "#ccc";
var dead_color = "black";
var wall_color = "#666"
var refresh_time = 100;
var ratio = 0.2;
var info_div;
var p_row;
var b_strat;

for(var i = 0; i < chess_row_number; i++) {
    chess_grid[i] = null;
    chess_grid_status[i] = 0;
    chess_grid_old_status[i] = 0;
}

//创建游戏界面
function createMap()
{
    /*global document:true*/
	if(setSettings())
	{
		var chess_grid_width;
		var chess_map_left;
		var chess_map_top;
		getRandomMap();
		if(document.documentElement.clientWidth < document.documentElement.clientHeight)
		{
			chess_grid_width = parseInt(document.documentElement.clientWidth * 0.8 / chess_row_number);
		}
		else
		{
			chess_grid_width = parseInt(document.documentElement.clientHeight * 0.8 / chess_row_number);	
		}
		chess_map_left = (document.documentElement.clientWidth - chess_row_number * chess_grid_width)/4.5;
		chess_map_top = (document.documentElement.clientHeight - chess_row_number * chess_grid_width)/2;
		for(var i = 0; i < chess_row_number * chess_row_number; i++)
		{
			chess_grid[i] = document.createElement("div");
			document.body.appendChild(chess_grid[i]);
            chess_grid[i].setAttribute("id", i);
			chess_grid[i].style.width = chess_grid_width+"px";
			chess_grid[i].style.height = chess_grid_width+"px";
			chess_grid[i].style.position = "absolute";
			chess_grid[i].style.left = chess_map_left + (i % chess_row_number) * chess_grid_width + "px";
			chess_grid[i].style.top = chess_map_top + parseInt(i / chess_row_number) * chess_grid_width + "px";
            chess_grid[i].onclick = function(){chess_grid_status[parseInt(this.id)] = 2;this.style.backgroundColor = wall_color;};
			if (chess_grid_status[i] == 1)
			{
				chess_grid[i].style.backgroundColor = life_color;
			}
			else
			{
				chess_grid[i].style.backgroundColor = dead_color;
			}
		}
		setInterval("refreshChessMap()", refresh_time);
	}
	info_div = document.createElement("div");
    info_div.style.width = chess_grid_width * chess_row_number * 0.75+ 'px';
    info_div.style.height = chess_grid_width * chess_row_number - 50 + 'px';
    info_div.style.position = "absolute";
    info_div.style.left = chess_map_left * 1.5 + chess_grid_width * chess_row_number + 'px';
    info_div.style.top = chess_map_top + "px";
    info_div.style.backgroundColor = '#CCC';
    info_div.style.border = '5px dashed #888';
    info_div.style.textAlign = 'center';
    info_div.style.paddingTop = "50px";
    document.body.appendChild(info_div);
    p_row = document.createElement("p");
    p_ratio = document.createElement("p");
    p_time = document.createElement("p");
    p_row.style.lineHeight = p_ratio.style.lineHeight = p_time.style.lineHeight = "50px";
    p_row.style.fontSize = p_ratio.style.fontSize = p_time.style.fontSize = "25px";
    p_row.style.fontFamily = p_ratio.style.fontFamily = p_time.style.fontFamily = "FZShuTi";
    p_row.innerHTML = "方格的边长：" + chess_row_number;
    p_time.innerHTML = "更新的时间：" + refresh_time + " ms";
    p_ratio.innerHTML = "初始活细胞比例：" + ratio;
    info_div.appendChild(p_row);
    info_div.appendChild(p_ratio);
    info_div.appendChild(p_time);
    b_start = document.createElement("button");
    b_start.onclick = function(){var settings = document.getElementById("settings");document.body.innerHTML = "";settings.style.display = "block";document.body.appendChild(settings);};
    b_start.style.position = "absolute";
    b_start.style.left = "50%";
    b_start.style.marginLeft = "-50px";
    b_start.style.bottom = "80px";
    b_start.style.width = "100px";
    b_start.style.height = "40px";
    b_start.innerText = "重新设置";
    info_div.appendChild(b_start);
}

function getRandomMap()
{
	var current_number;
	for(var  i = 0; i < chess_row_number * chess_row_number; i ++)
	{
		current_number = Math.random();
		if (current_number < ratio)
		{
			chess_grid_status[i] = 1;
		}
		else
		{
			chess_grid_status[i] = 0;
		}
	}
}

//x为中心细胞坐标，i取值从0到7，依次代表上1，上2，下1，下2，左1，左2，右1，右2,返回对应neighbour坐标，如果不在范围内则返回-1
function getCellNeighbour(x, i)
{
    if(i == 0)
    {
        if(x - chess_row_number < 0)
            return -1;
        else
            return x - chess_row_number;
    }
    else if(i == 1)
    {
        if(x - chess_row_number * 2 < 0)
            return -1;
        else
            return x - chess_row_number * 2;
    }
    else if(i == 2)
    {
        if(x + chess_row_number >= chess_row_number * chess_row_number)
            return -1;
        else
            return x + chess_row_number;
    }
    else if(i == 3)
    {
        if(x + chess_row_number * 2 >= chess_row_number * chess_row_number)
            return -1;
        else
            return x + chess_row_number * 2;
    }
    else if(i == 4)
    {
        if(x - 1 < x - (x % chess_row_number))
            return -1;
        else
            return x - 1;
    }
    else if(i == 5)
    {
        if(x - 2 < x - (x % chess_row_number))
            return -1;
        else
            return x - 2;
    }
    else if(i == 6)
    {
        if(x + 1 >= x - (x % chess_row_number) + chess_row_number)
            return -1;
        else
            return x + 1;
    }
    else if(i == 7)
    {
        if(x + 2 >= x - (x % chess_row_number) + chess_row_number)
            return -1;
        else
            return x + 2;
    }
    else
        return -1;
}

//判断每个细胞新的状态
function checkChessGridStatus(i)
{
    if(chess_grid_old_status[i] == 2)
    {
        chess_grid_status[i] = 2;
        chess_grid[i].style.backgroundColor = wall_color;
        return;
    } 
	var life_number = 0;
    var neighbour_cell = -1;
	for(var j = 0; j < 8; j++)
	{
        neighbour_cell = getCellNeighbour(i, j);
		if (neighbour_cell != -1 && chess_grid_old_status[neighbour_cell]== 1)
		{
			life_number ++;
		}
	}
	if(life_number == 3)
	{
		chess_grid_status[i] = 1;
		chess_grid[i].style.backgroundColor = life_color;
	}
	else if(life_number != 2)
	{
		chess_grid_status[i] = 0;
		chess_grid[i].style.backgroundColor = dead_color;
	}
		
}

//刷新
function refreshChessMap()
{
	for(var i = 0; i < chess_row_number * chess_row_number; i++)
	{
		chess_grid_old_status[i] = chess_grid_status[i];
	}
	for(i = 0; i < chess_row_number * chess_row_number; i++)
	{
		checkChessGridStatus(i);
	}
}

function setStyle(i)
{
	var dead_color_array = ["black","#FEE3E3","#FEFEE3","#E3FEE3","#E3FEFE","#E3E3FE","#FEE3FE"];
	var life_color_array = ["#ccc","#D65858","#D6D658","#58D658","#58D6D6","#5858D6","#D658D6"];
	dead_color = dead_color_array[i];
	life_color = life_color_array[i];
	for(var j = 0; j < 7; j++)
	{
		if(j!=i)
		{
			document.getElementById("style"+j).style.border = "";
		}
		else
		{
			document.getElementById("style"+i).style.border = "5px solid blue";
		}
	}
}

function setSettings()
{
	if (checkSettings())
	{
		chess_row_number = parseInt(eval(document.getElementById("row_number_input")).value);
		refresh_time = parseFloat(eval(document.getElementById("refresh_time_input")).value)*1000;
		ratio = eval(document.getElementById("ratio_input")).value;
		document.getElementById("settings").style.display = "none";
		return true;
	}
	return false;
}

function checkNumber(obj)
{
    /*global alert:true*/
	//var re = /^-?[1-9]*(.d*)?$|^-?0(.d*)?$/;
	var re = /^\d+(\.\d+)?$/;
	if(!re.test(obj.value))
	{
		alert("请输入数字。");
		obj.value = "";
		obj.focus();
		return false;
	}
	return true;
}

function checkPositiveNumber(obj)
{
    /*global alert:true*/
	var re = /^[0-9]*[1-9][0-9]*$/;
	if(!re.test(obj.value))
	{
		alert("请输入正整数。");
		obj.value = "";
		obj.focus();
		return false;
	}
	return true;
}

function checkEmpty(obj)
{
    /*global alert:true*/
	if(obj.value =="")
	{
		alert("输入不能为空。");
		obj.value = "";
		obj.focus();
		return false;
	}
	return true;
}


function checkSettings()
{
    /*global alert:true*/
	if(!checkPositiveNumber(document.getElementById("row_number_input")))
	{
		return false;
	}
	if(!checkNumber(document.getElementById("refresh_time_input")))
	{
		return false;
	}
	if(!checkNumber(document.getElementById("ratio_input")))
	{
		return false;
	}
	if(!checkEmpty(document.getElementById("row_number_input")))
	{
		return false;
	}
	if(!checkEmpty(document.getElementById("refresh_time_input")))
	{
		return false;
	}
	if(!checkEmpty(document.getElementById("ratio_input")))
	{
		return false;
	}
	if(parseInt(eval(document.getElementById("row_number_input")).value)>500||parseInt(eval(document.getElementById("row_number_input")).value)<=0)
	{
		alert("请输入0~500间的正整数。");
		document.getElementById("row_number_input").value = "";
		document.getElementById("row_number_input").focus();
		return false;
	}
	if(parseInt(eval(document.getElementById("ratio_input")).value)>1||parseInt(eval(document.getElementById("ratio_input")).value)<0)
	{
		alert("请输入0~1间的数。");
		document.getElementById("ratio_input").value = "";
		document.getElementById("ratio_input").focus();
		return false;
	}
	return true;
}