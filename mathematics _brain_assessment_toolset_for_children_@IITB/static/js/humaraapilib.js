var attempt;
var flagBoardAdd = 0;
var rhywordIndex;
var ascendingdescendingcounter=1;
var objectIndex;
var colorArray =["",0xff0000,0x0000ff,0xffff00,0x000000,0xffffff,0x000080,0x008000,0xc0c0c0,0x808080,
						0x808000,0x00ff00,0xff69b4,0xffa500,0x800080,0x800000,0xffd700];
var colorNameArray=["","Red","Blue","Yellow","Black","White","Dark Blue","Green","Silver","Grey",
						"Olive","Lime","Pink","Orange","Purple","Maroon","Gold"];
var shapeNameArray=["","Box","Rectangle","Square","Triangle","Pentagon","Hexagon","Decagon"
						,"Octagon","Cylinder","Circle","Line","Segment"];
var color;
var flagMove = true;
var movingCount = 0;
var CirX;
var CirY;
var circle;
var cubeCount;
var cube;
var operation;
var total;
var circleCount = 1;
var ans = 1;
var sceneL;
var correctAns;
var objectsArray;
var numbersArray;
var objects = new Array();
var correctAnsArray = [];
var targetList = [];
var numArray = [];
var level;
var score = 0;
var array;
var mazeX = 0;
var assessmentCount_positive = 0;
var assessmentCount_negative = 0;
var rendererCount = 0;
var onDocumentMouseDown_BoardGame;
var onDocumentMouseDown_NumLine;
var onDocumentMouseDown_mineSweeper;
var onDocumentMouseDown_BoardGameCircle;
var t, s;
var apilib = {

	getCookie: function(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                  var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                 var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
               }
            }
        }
   return cookieValue;
  },


	send :function(subjectname, themename, solvedtime, level, question, userresponse, correctanswer, options, attempt) { 
     //$('#send').html("sending");
    // alert('hewi');

	var csrftoken = apilib.getCookie('csrftoken');

    var submitdata={
	    subjectname:subjectname,
	    themename:themename,
	    solvedtime:solvedtime,
	    level:level,
	    question:question,
	    userresponse:userresponse,
	    correctanswer:correctanswer,
	    options:options,
	    attempt:attempt,
	    csrfmiddlewaretoken : csrftoken
	};

     $.ajax({
         url: '/app/submitdata/',
         type: 'post',
         dataType: 'json',
         success: function (data) {
              //$('#send').html("sent");

              console.log('succcees');
         },
         error: function(data){
            //$('#send').html("not sent");
              console.log('error'+data);
         },
         data: submitdata
     });
  },


	loadJS : function(path){
		var jsElm = document.createElement("script");
		jsElm.type = "application/javascript";
		jsElm.src = path;
		document.getElementsByTagName('head')[0].appendChild(jsElm);
	},
//Evaluate Dynamic Functions
	evalFunc : function(functionName,params){
		var para = new Array();
		console.log(functionName);
		console.log(params);
		var evalPar;
		for(var j = 0; j < params.length; j++)
		{
			evalPar = eval(params[j].data);
			para.push(evalPar);
		}
		return window["apilib"][functionName](para);
	},
//Random Functions
	shuffle : function(optArray){
		var ranNums = [];
	    var i = optArray.length;
	    var j = 0;
		while (i--) {
		    j = Math.floor(Math.random() * (i+1));
		    ranNums.push(optArray[j]);
		    optArray.splice(j,1);
		}
		return ranNums;
	},
	randIntervalInt : function(params){
		var min, max;
		var interval = params[1];
		if(params[0] > interval){
			min = params[0] - interval;
			max = params[0] + interval;
		}
		else{
			min = 1;
			max = interval;	
		}
		return Math.floor(Math.random() * ( max - min + 1 )) + min;

	},
	randInt : function(params){
		var min = params[0];
		var max = params[1];
		return Math.floor(Math.random() * ( max - min + 1 )) + min;

	},
	randZeroInt : function(params){
		var num = apilib.randInt(params);
		var x;
		var count = 1;
		var n1 = num;
		while(num>9)
		{
			x = num%10;
			if(x < 5){
				n1 = n1 - x*count;
			}
			num = Math.floor(num/10);
			count = count*10;		
		}
		return n1;
	},
	
	generateFraction : function(params){
		var flag = params[0];
		var min = params[1];
		var max = params[2];
		var num = apilib.randInt([min, max]);
		while(num == max){
			num = apilib.randInt([min, max]);
		}
		while(true){
			var num1 = apilib.randInt([min, max]);
			if(num1 != num && num1 > num)
				break;
		}
		var gcd = apilib.findGcd([num,num1]);
		correctAns = (num/gcd) + "/" + (num1/gcd);
		if(flag == 0)
			return correctAns;
		else if(flag == 1){
			var a = eval(correctAns) * 100;
			if(Math.floor(a) === a)
				return a;
			else
				return a.toFixed(2);
		}
	},
	generateFractionSub : function(params){
		if(rendererCount == s[s.length-1].rendererCount)
			rendererCount = 0;
		var flag = params[0];
		max=20;
		min=1;
		var num = apilib.randInt([min, max]);
		while(num == max){
			num = apilib.randInt([min, max]);
		}
		while(true){
			var num1 = apilib.randInt([min, max]);
			if(num1 != num && num1 > num)
				break;
		}
		var gcd = apilib.findGcd([num,num1]);
		correctAns = (num/gcd) + "/" + (num1/gcd);
		window["num"+rendererCount] = correctAns;
		if(rendererCount >= 1)
		{ 
			var arr = window["num"+ 0].split("/");
			var arr1 = window["num"+ 1].split("/");
			while(arr[0]*arr1[1]<arr[1]*arr1[0]){
				num = apilib.randInt([min, max]);
				while(num == max){
				num = apilib.randInt([min, max]);
				}
				while(true){
				var num1 = apilib.randInt([min, max]);
				if(num1 != num && num1 > num)
				break;
				}
				var gcd = apilib.findGcd([num,num1]);
				correctAns = (num/gcd) + "/" + (num1/gcd);
				window["num"+rendererCount] = correctAns;
				arr1[0]=num;
				arr1[1]=num1;
			}
		}
		return window["num"+rendererCount];
	},
	generateTwinPrime : function(params){
		var b = apilib.randInt([0,1]);
		var s;
		if(b == 1){
			var arr = [[3,5],[5,7],[11,13],[17,19],[29,31],[41,43],[59,61],[71,73],[101,103],[107,109],[137,139]]
			var x = apilib.randInt([0,10]);
			return ([arr[x][0],arr[x][1]]);
		}
		else{			
			x = apilib.randInt(params);			
			var y = apilib.randInt(params);
			return ([x,y]);
		}
	},
	generateCoPrime : function(params){
		var x = apilib.randInt(params);
		var y = apilib.randInt(params);
		return([x,y]);
	},

	numToName : function(params){
		var nameArray = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
		"Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
		if(params.length > 1)
		{
			var num = apilib.randInt(params);
		}
		else
			var num = params[0];
		var string;
		if(num >= 20)
		{
			var ten = Math.floor(num/10);
			var unit = num%10;
			switch(ten)
			{
				case 2:
					string = "Twenty "+nameArray[unit];
					break;
				case 3:
					string = "Thirty "+nameArray[unit];
					break;
				case 4:
					string = "Forty "+nameArray[unit];
					break;
				case 5:
					string = "Fifty "+nameArray[unit];
					break;
				case 6:
					string = "Sixty "+nameArray[unit];
					break;
				case 7:
					string = "Seventy "+nameArray[unit];
					break;
				case 8:
					string = "Eighty "+nameArray[unit];
					break;
				case 9:
					string = "Ninety "+nameArray[unit];
					break;
				case 10:
					string = "Hundred";
					break;	
			}
			if(unit == 0)
				return string.substring(0, string.length-1);
			else
				return string;
		}
		else 
		{
			switch(num)
			{
				case 0:
					return("Zero");
				default:
					return(nameArray[num]);
			}
		}

	},	

	nameToNum : function(name){
		var nameArray = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
		"Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
		var array = name.split(" ");
		var num = '';
		if(array.length == 2){
			switch(array[0])
			{
				case "Twenty":
					num += "2";
					break;
				case "Thirty":
					num += "3";
					break;
				case "Forty":
					num += "4";
					break;
				case "Fifty":
					num += "5";
					break;
				case "Sixty":
					num += "6";
					break;
				case "Seventy":
					num += "7";
					break;
				case "Eighty":
					num += "8";
					break;
				case "Ninety":
					num += "9";
					break;
			}
			if(array[1]){
				switch(array[1])
				{
					case "One":
						return num + "1";
					case "Two":
						return num + "2";
					case "Three":
						return num + "3";
					case "Four":
						return num + "4";
					case "Five":
						return num + "5";
					case "Six":
						return num + "6";
					case "Seven":
						return num + "7";
					case "Eight":
						return num + "8";
					case "Nine":
						return num + "9";
				}
			}
		}
		else
		{
			for(var i = 0; i < nameArray.length; i++)
			{
				if(array[0] == nameArray[i])
					return i;
			}
			switch(array[0])
			{
				case "Zero":
					return "0";
				case "Twenty":
					return "20";
				case "Thirty":
					return "30";
				case "Forty":
					return "40";
				case "Fifty":
					return "50";
				case "Sixty":
					return "60";
				case "Seventy":
					return "70";
				case "Eighty":
					return "80";
				case "Ninety":
					return "90";
				case "Hundred":
					return "100";
			}
		}

	},	
	numberLineUtil : function(params)
	{
		var startRange = params[0];
		var endRange = params[1];
		var quant = params[2];
		var num;
		var numArray = [];
		for(var i = 0; i < quant; i++)
		{
			repeat = false;
			num = apilib.randInt([startRange,endRange]);
			for(var j = 0; j < numArray.length; j++)
			{
				if(num == numArray[j]){
					repeat = true;
					i--;
					break;
				}
			}
			if(!repeat){
				numArray.push(num);
			}
		}
		return numArray;
	},
	numberLineSub : function(params)
	{
		var arr = apilib.numberLineUtil(params);
		alert(arr);
		var n = arr[0]+arr[1];
		var temp;
		if(arr[1]>arr[0])
		{
			temp=arr[0];
			arr[0]=arr[1];
			arr[1]=temp;

		}
		arr[0]=n;
		return arr;
	},
	numberLineSuc : function(params)
	{
		//alert("params"+ params[0]+" "+params[1])
		var arr=[]
		var x= apilib.randInt([params[0],params[1]]);
		arr.push(x);
		//alert("x "+x)
		return arr
	},
	numberLineCo : function(params)
	{
		var arr=[]
		arr.push(1);
		arr.push(2);
		return arr;

	},
	

	calcRange : function(operation,lightUp){
		switch(operation){
			case "numLineSub":
				var diff = Math.abs(lightUp[0] - 2*lightUp[1]);
				if(lightUp[0]-lightUp[1] > lightUp[1])
				{
					startRange = lightUp[1];
					endRange = (lightUp[0]-lightUp[1] ) * 2 - diff + apilib.randInt([1,5]);
				}
				else
				{
					startRange = lightUp[0]-lightUp[1] ;
					endRange = lightUp[1] * 2 - diff + apilib.randInt([1,5]);
				}
				return [startRange,endRange];

			case "numLineAdd":
				var diff = Math.abs(lightUp[0] - lightUp[1]);
				if(lightUp[0] > lightUp[1])
				{
					startRange = lightUp[1];
					endRange = lightUp[0] * 2 - diff + apilib.randInt([1,5]);
				}
				else
				{
					startRange = lightUp[0];
					endRange = lightUp[1] * 2 - diff + apilib.randInt([1,5]);
					var temp = lightUp[0];
					lightUp[0]=lightUp[1];
					lightUp[1]=temp;
				}
				return [startRange,endRange];
			case "numLineSuc":
				var startRange = lightUp[0]- apilib.randInt([1,5]);
				var endRange  =  lightUp[0] + apilib.randInt([2,10]);
				return [startRange,endRange];
			case "numLinePred":
				var startRange = lightUp[0]- apilib.randInt([1,5]);
				var endRange  =  lightUp[0] + apilib.randInt([2,10]);
				return [startRange,endRange];
			case "numLineCo":;
				return [apilib.randInt([2,5]),apilib.randInt([15,20])]
		}
	},

	createNumberLine : function(params)
	{
		x=0;
		total = [];
		targetList = [];
		var lightUp = params[0];
		alert(lightUp)
		var diff = 1;
		var range = [];
		var lineI = [];
		var star = [];
		var selected = [];
		var startRange;//params[0];
		var endRange;//params[1];
		var material = new THREE.LineBasicMaterial({color: 0xffffff});
		var geometryI = new THREE.Geometry();
		var range = apilib.calcRange(operation,lightUp);
		startRange = range[0];
		endRange = range[1];
		var point = new THREE.Vector3(0,0,0);
		var r=(27)*10/((endRange-startRange)/diff+1);
		//alert("r "+r)
		r= r/(2*Math.PI);
		var temp;
		
		geometryI.vertices.push(
			new THREE.Vector3( 0, 0, 400 ),
			new THREE.Vector3( 0, 0, 400),
			new THREE.Vector3( 0, -7, 400 )
		);
		var geometry2 = new THREE.Geometry();
		geometry2.vertices.push(
			new THREE.Vector3(-50,0,466),
			new THREE.Vector3(0,0,466),
			new THREE.Vector3(50,0,466)
		);
		var materialFront = new THREE.MeshBasicMaterial( { color: 0x000000 } );
		var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
		var materialArray = [ materialFront, materialSide ];
		var textMaterial = new THREE.MeshFaceMaterial(materialArray);
		var cube = [];
		var count = startRange;;
		var pts = [], numPts = 5;
		for ( var i = 0; i < numPts * 2; i ++ ) {
			var l = i % 2 == 1 ? 3: 6;
			var a = i / numPts * Math.PI;
			pts.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );
		}
		var shape = new THREE.Shape( pts );
		var rectGeom = new THREE.ShapeGeometry( shape );
		for(var i=0;i<(endRange-startRange)/diff+1;i++,x++){
		    lineI[i] = new THREE.Line( geometryI, material );
			window["scene"+rendererCount].add( lineI[i]);
			lineI[i].position.x=-130+(27)*10/((endRange-startRange)/diff+1)*(i);
			var dynamicTexture	= new THREEx.DynamicTexture(512,512);
			dynamicTexture.context.font	= "bolder 400px Aller";
			var geometryc = new THREE.BoxGeometry( 7,7, 0.1 );
		    var materialc = new THREE.MeshBasicMaterial( {color: 0xffffff,map : dynamicTexture.texture} );
			cube[i] = new THREE.Mesh( geometryc, materialc );
			dynamicTexture.clear('cyan')
			.drawText(count, 64, 300, 'black');
			count += diff
		    window["scene"+rendererCount].add(cube[i]);
		    cube[i].position.set( -130+(27)*10/((endRange-startRange)/diff+1)*(i), -7,401 );
		    star[i] = new THREE.Mesh( rectGeom, new THREE.MeshBasicMaterial( { color: 0x000000 } ) ) ;
			star[i].rotation.z = 0.3;
			star[i].position.set(-130+(27)*10/((endRange-startRange)/diff+1)*(i),3,399);

			window["scene"+rendererCount].add( star[i] );
			console.log("i = " + cube[i].material.map.id);
			targetList.push(cube[i]);
		}


		// *********************error here **********************************************************************************************************
		number+=x;
	//	alert(cube);
		if(operation!="numLineCo")
		{
			for(var i = 0; i < lightUp.length;i++ ){
			star[lightUp[i]-startRange].material.color.setHex(0xffff00);
			cube[lightUp[i]-startRange].material.color.setHex(0xffff00);
		}
		}
		lineI[i] = new THREE.Line(geometry2,material);
		window["scene"+rendererCount].add(lineI[i]);
		lineI[i].position.set = (0,0,400);

		//clickable_local
		var projector, mouse = { x: 0, y: 0 }, x_coor, y_coor, x, y;
		projector = new THREE.Projector();
		function cursorPositionInCanvas(canvas, event){
            var x, y;
            canoffset = $(canvas).offset();
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
            return [x,y];
        }
        function timeout(i,ti,n,x,y) {
			if(ti>=Math.abs(n*2*Math.PI))
			{
				return;
			}
			else{
    			setTimeout(function () {
    				star[i].position.x = x+r*(ti-Math.sin(ti));
    				star[i].position.y = y+Math.abs(r)*(1-Math.cos(ti));
    				star[i].rotation.z+=0.1;
    				ti+=0.2;

        			timeout(i,ti,n,x,y);
    			}, 25);
			}
		}
        function move(from,to)
        {
        	var n = to -from;
        	alert("n "+n+" r "+Math.PI*2*r);
        	r= Math.abs(r);
        	if(n<0) r=r*-1;
        	star[from].position.z+=0.1;
        	star[to].position.x=star[from].position.x;
        	star[to].position.y=star[from].position.y;
        	star[to].position.z=star[from].position.z;
        	timeout(from,0,n,star[from].position.x,star[from].position.y);

        }

        onDocumentMouseDown_NumLine=function(event)
    	{
    		mouse.x = ((cursorPositionInCanvas( renderer0.domElement, event )[0]) / $(canvas).width()) * 2 - 1;
			mouse.y = - ((cursorPositionInCanvas( renderer0.domElement, event )[1])/ $(canvas).height()) * 2 + 1;
			var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			projector.unprojectVector( vector, camera0 );
			var ray = new THREE.Raycaster( camera0.position, vector.sub( camera0.position ).normalize() );
			intersects = ray.intersectObjects( targetList );
			console.log(targetList);
			//alert(intersects);
			if ( intersects.length > 0 )
			{
				console.log(intersects.length+" length")
				intersects[0].object.material.color.setHex(0xffff00);
				console.log("start "+startRange);
				console.log(intersects[0].object.material.map.id-number+x+" id");
				console.log((intersects[0].object.material.map.id-number+x)*diff+startRange);
				total.push((intersects[0].object.material.map.id-number+x)*diff+startRange);
				star[intersects[intersects.length - 1].object.material.map.id-number+x].material.color.setHex(0xffff00);
				console.log(temp)
				if(operation!="numLineCo")
					move(lightUp[0]-startRange,intersects[intersects.length - 1].object.material.map.id-number+x);
				if(operation=="numLineCo"&&total.length>1)
					apilib.calculate(total,apilib.operate([10]));
				
			}
			//alert("total = "+total);

		};
		document.getElementById("rendererDiv0").addEventListener( 'mousedown', onDocumentMouseDown_NumLine, false );

	},
	Clickable_movingCircle : function(params)
	{
		if(params == false)
			return;
		var projector, mouse = { x: 0, y: 0 }, x_coor, y_coor, x, y;
		total = [];
		projector = new THREE.Projector();
		function cursorPositionInCanvas(canvas, event) {
	        var x, y;
	        canoffset = $(canvas).offset();
	        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - 
	        							Math.floor(canoffset.left);
	        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - 
	        							Math.floor(canoffset.top) + 1;

	        return [x,y];
		}
		var render_circle = function(){
			var curr = apilib.calculatePosition(ans);
			if(CirX != curr[0] || CirY != curr[1]){
				if(ans > circleCount){
					flagMove = apilib.MovingCircle(circle,circleCount,ans,flagMove);
				}
				else if(ans < circleCount){
					flagMove = apilib.MovingCircle(circle,circleCount,ans,flagMove);
				}
			}	
			else
				return;
			requestAnimationFrame(render_circle);
			renderer0.render(scene0,camera0);	
		};
		onDocumentMouseDown_BoardGameCircle = function( event ) 
		{
			mouse.x = ((cursorPositionInCanvas( renderer0.domElement, event )[0]) / $(canvas).width()) * 2 - 1;
			mouse.y = - ((cursorPositionInCanvas( renderer0.domElement, event )[1])/ $(canvas).height()) * 2 + 1;
			var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			projector.unprojectVector( vector, camera0 );
			var ray = new THREE.Raycaster( camera0.position, vector.sub( camera0.position ).normalize() );
			intersects = ray.intersectObjects( targetList );
			if ( intersects.length > 0 )
			{
				total = [];
				if(circleCount % 10 == 0 && flagBoardAdd == 0){
					flagMove = !flagMove;
					alert(flagMove);
				}
				if(flagBoardAdd == 1){
					circleCount = ans;
					flagBoardAdd = 0;
				}
				movingCount = 0;
				ans = intersects[intersects.length-1].object.material.map.id + 1 - (mazeX - 1)*102;
				total.push(ans);
				alert(circleCount);
				alert(ans);
			//	intersects[intersects.length - 1].object.material.color.setHex( 0x000000 );
				if(ans > circleCount){
					alert("herr")
					intersects[intersects.length - 1].object.material.color.setHex( 0xF01212 );
					render_circle();
				}
				/*if(ans > circleCount - 6){
					if(ans < circleCount){
						if(circleCount != 1)
							flagMove = false;
						render_circle();
					}
					else{
						flagMove = true;
						render_circle();	
					}
				}*/
			}
		};
		document.getElementById("rendererDiv0").addEventListener( 'mousedown', onDocumentMouseDown_BoardGameCircle, false );
	},

	Clickable : function(params)
	{
		if(params == false)
			return;
		var projector, mouse = { x: 0, y: 0 }, x_coor, y_coor, x, y;
		total = [];
		projector = new THREE.Projector();
		function cursorPositionInCanvas(canvas, event) {
	        var x, y;
	        canoffset = $(canvas).offset();
	        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - 
	        							Math.floor(canoffset.left);
	        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - 
	        							Math.floor(canoffset.top) + 1;

	        return [x,y];
		}
		onDocumentMouseDown_BoardGame = function( event ) 
		{
			mouse.x = ((cursorPositionInCanvas( renderer0.domElement, event )[0]) / $(canvas).width()) * 2 - 1;
			mouse.y = - ((cursorPositionInCanvas( renderer0.domElement, event )[1])/ $(canvas).height()) * 2 + 1;
			var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			projector.unprojectVector( vector, camera0 );
			var ray = new THREE.Raycaster( camera0.position, vector.sub( camera0.position ).normalize() );
			intersects = ray.intersectObjects( targetList );
			if ( intersects.length > 0 )
			{
				ans = intersects[intersects.length-1].object.material.map.id + 1 - (mazeX - 1)*101;
				total.push(ans);
				intersects[intersects.length - 1].object.material.color.setHex( 0x000000 );
				intersects[intersects.length - 1].object.material.color.setHex( 0xF01212 );
			}
		};
		document.getElementById("rendererDiv0").addEventListener( 'mousedown', onDocumentMouseDown_BoardGame, false );
	},
	MovingCircle : function(circle,circleCount,ans,flagMove)
	{
		if(movingCount == 0){
			var prev = apilib.calculatePosition(circleCount);
			CirX = prev[0];
			CirY = prev[1];
			movingCount = 1;
			CurrCount = circleCount*19;
		}
		if((CurrCount/19)%10==0)	
		{
			
			flagMove = !flagMove;
	    	CirY += 9.5; 
			if(flagMove==true)
			{
				CirX += 1;
			}
			else
			{
				CirX -= 1;
			}
	    }
		if(flagMove==true)
		{
			CirX += 1;
		}
		else
		{
			CirX -= 1;
		}
		circle.position.set(CirX,CirY,420);
	    CurrCount += 1;
	    return flagMove;
	},
	MakeDice : function()
	{
		var ti = 25;
		var randomNo;
		dynamicTexture	= new THREEx.DynamicTexture(384,384);
		dynamicTexture.context.font	= "bolder 200px Verdana";
		var geometry = new THREE.CubeGeometry( 14, 14, 14);
		var material = new THREE.MeshBasicMaterial({
			map : dynamicTexture.texture
		});
		mesh = new THREE.Mesh( geometry, material );
		edges = new THREE.EdgesHelper( mesh, 0xffffff );
		mesh.position.set(87,0,425);
		scene0.add( mesh );
		scene0.add(edges);
		timeout(ti);
		//correctAns = randomNo;
		function timeout(ti) {
			if(ti==0)
			{
				dynamicTexture.clear('black')
				.drawText(correctAns, undefined, 256, 'white')
				return;
			}
			else{
    			setTimeout(function () {
    				if(ti>0)
					{
						mesh.rotation.x += 20;
						mesh.rotation.y += 20;
						mesh.rotation.z += 20;
						ti-=1;
						randomNo = Math.floor((Math.random()*5) + 1);
						dynamicTexture.clear('black')
						.drawText(randomNo, undefined, 256, 'white')
					}
        			timeout(ti);
    			}, 50);
			}
		}
	},

	calculatePosition : function(count){
		var CurrX = -123;
		var CurrY = -39.5;
		var countX = count % 10;
		var countY = Math.floor(count / 10);
		if(countX == 0){
			countY--;
			countX = 10;
		}
		if(countY % 2 == 0)
		{
			flag = true;
		}
		else
		{
			flag = false;
		}
    	CurrY += 9.5 * countY; 
		if(flag==true)
		{
			CurrX += countX * 19;
		}
		else
		{
			CurrX += 19 * (10 - countX + 1) ;
		}
		return [CurrX,CurrY];
	},	

	CirMake : function(params)
	{
		var count = params[0], flag = true;
		alert("cir"+count);
		var curr = apilib.calculatePosition(count);
		var CurrX = curr[0];
		var CurrY = curr[1];
		var geometry = new THREE.CircleGeometry( window.innerWidth / 350,100 );
		var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		circle = new THREE.Mesh( geometry, material );
		circle.position.set(CurrX,CurrY,420);
		scene0.add( circle );
		return circle;
	},
	MakeBoard : function(params)
	{
		var Array1 = params[0];
		mazeX++;
		var fl = Array1[0];
		var Params = Array1[1]+2,Ipar=2;
		var flagi=0;
	 	var cube=[];
	 	if(fl == 0)
	 	{
	 		startRange = Array1[2];
	 		endRange = Array1[3];
	 	}	
		var count = 0, rectLength = 20, rectWidth = 10, CurrX=-110, CurrY=-40.5, flag=true;
		while(count<100)
		{
	    	dynamicTexture	= new THREEx.DynamicTexture(350,350);
			dynamicTexture.context.font	= "bolder 120px Verdana";
	    	var geometry = new THREE.BoxGeometry( 20,13, 0.1 );
			if(count%2==0)
			{
				var material = new THREE.MeshBasicMaterial( {color: 0x00ffff,map : dynamicTexture.texture} );
			}
			else
			{
				var material = new THREE.MeshBasicMaterial( {color: 0x00ff00,map : dynamicTexture.texture} );
			}
			cube[count] = new THREE.Mesh( geometry, material );
			scene0.add( cube[count] );
			cube[count].position.set(CurrX,CurrY,415);
			
			if(fl==1)
			{
				if(Ipar<Params)
				{
					for(var i=2;i<Params;i++)
					{
						if(Array1[i]==(count+1))
						{
							dynamicTexture.clear('cyan')
							.drawText(count+1, undefined, 256, 'blue')
							targetList.push(cube[count]);
							Ipar += 1;
							flagi=1;
							break;
						}
					}
				}
				if(flagi == 0)
				{
					dynamicTexture.clear('cyan')
					.drawText('', undefined, 256, 'blue')
				}
				flagi=0;
			}
			else
			{
				if(startRange <= endRange){
					dynamicTexture.clear('cyan')
					.drawText(startRange, undefined, 256, 'blue')
					targetList.push(cube[count]);
					startRange++;
				}
			}
			count+=1;
	    	if(flag==true)
	    	{
	    		CurrX += rectLength;
	    	}
	    	else
	    	{
	    		CurrX -= rectLength;
	    	}
	    	
	    	if(count%10==0)
	    	{
	    		if(flag==true)
	    		{
	    			CurrX -= rectLength;
	    		}
	    		else
	    		{
	    			CurrX += rectLength;
	    		}
	        	flag = !flag;
	        	CurrY += rectWidth;
	        }
	    }
	    cubeCount = count;
	},
	makeBoardGame : function(params){
		var array = [];
		array = params[1];
		var correctAns = params[0];
		for(var i = 0; i < array.length - 2; i++)
		{
			var obj = eval(array[i]);
				console.log(obj[0].functions[0].functionName);
			for(var j = 0; j < obj[0].functions.length; j++)
			{
				window[obj[0].functions[j].returnValue] = apilib.evalFunc(
					obj[0].functions[j].functionName,
								obj[0].functions[j].params);
			}
		}
		var string = array[array.length - 2];
		string = String(string);
		var param = [];
		param.push(array[array.length - 1]);
		var functionNameClick = string.substring(1,string.length-1);
		window["apilib"][functionNameClick](param);
	},
	createObjectsForMaze : function(params){
	    return params;
	},	

	numbersOnMaze : function(params){
		var numbersArray = [], repeat = false, numArray = [];
		var flag = params[0];
		var count = params[1];
		var startRange = params[2];
		var endRange = params[3];
		numbersArray.push(flag);
		numbersArray.push(count);
		if(flag == 1)
		{
			correctAns = [];
			for(var i = 0; i < count; i++)
			{
				var num = apilib.randInt([startRange, endRange]);
				for(var j = 0; j < numArray.length; j++)
				{
					if(numArray[j] == num)
					{
						i--;
						repeat = true;
						break;
					}
				}
				if(!repeat)
					numArray.push(num);
			}
			for(var i = 0; i < numArray.length; i++)
			{
				numbersArray.push(numArray[i]);
				correctAns.push(numArray[i]);
			}
		}
		else if(flag == 0)
		{
			numbersArray.push(startRange);
			numbersArray.push(endRange);
		}
	    return numbersArray;
	},	

	FracAdd : function(num1,num2)
	{
		alert(num1);
		alert(num2);
		var  arr = num1.split("/");
		var arr1 = num2.split("/");
		var num3 = arr[0]*arr1[1]+arr1[0]*arr[1];
		var num4 = arr[1]*arr1[1];
		var gcd = apilib.findGcd([num3 , num4]);
		num3=num3/gcd;
		num4=num4/gcd;
		var str = num3 + "/" + num4;
		return str;
	},
	FracSub : function(num1,num2)
	{
		//alert(num1);
		//alert(num2);
		var  arr = num1.split("/");
		var arr1 = num2.split("/");
		var num3 = arr[0]*arr1[1]-arr1[0]*arr[1];
		var num4 = arr[1]*arr1[1];
		var str;
		if(num3!=0)
		{
			var gcd = apilib.findGcd([num3 , num4]);
			num3=num3/gcd;
			num4=num4/gcd;
			str = num3 + "/" + num4;
		}
		else
		{
			str = "0";
		}
		
		return str;
	},
	FracMul : function(num1,num2)
	{
		alert(num1);
		alert(num2);
		var  arr = num1.split("/");
		var arr1 = num2.split("/");
		var num3 = arr[0]*arr1[0]
		var num4 = arr[1]*arr1[1];
		var gcd = apilib.findGcd([num3 , num4]);
		num3=num3/gcd;
		num4=num4/gcd;
		var str = num3 + "/" + num4;
		return str;
	},
	FracDiv : function(num1,num2)
	{
		alert(num1);
		alert(num2);
		var  arr = num1.split("/");
		var arr1 = num2.split("/");
		var num3 = arr[0]*arr1[1]
		var num4 = arr[1]*arr1[0];
		var gcd = apilib.findGcd([num3 , num4]);
		num3=num3/gcd;
		num4=num4/gcd;
		var str = num3 + "/" + num4;
		return str;
	},

	randshapename : function(params)
	{
		var randShape = apilib.randInt(params);
		return shapeNameArray[randShape];
	},
	randcolorname : function(params)
	{
		var randColor = apilib.randInt(params);
		return colorNameArray[randColor];
	},

    draw : function()
    {

    },
    mirrorimage : function(params)
    {

    	var arr=["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    	var Imagearr=["cat","dog","",""];
    	var x,y;
    	max=params[0];
    	min=params[1];
    	x=Math.floor(Math.random() * ( max - min + 1 )) + min;
    	y=Math.floor(Math.random() * ( max - min + 1 )) + min;
    	 var dynamicTexture	= new THREEx.DynamicTexture(512,512);
		dynamicTexture.context.font	= "bold "+(341*512)+"px Arial";
		//dynamicTexture.texture.anisotropy = renderer.getMaxAnisotropy()
		// update the text
		dynamicTexture.clear('white')
		var z=Math.floor(Math.random() * ( 2 - 1 + 1 )) + 1;
		if(z==1)
		{
			y=x;
		}
		// dynamictexture.drawText('Hello', undefined, 256, 'red')
		dynamicTexture.drawTextCooked({
			text		: arr[y],
			lineHeight	: 0.5,
		});

		 var dynamicTexture1	= new THREEx.DynamicTexture(512,512);
		dynamicTexture1.context.font	= "bold "+(.341*512)+"px Arial";
		//dynamicTexture1.texture.anisotropy = renderer.getMaxAnisotropy()
		// update the text
		dynamicTexture1.clear('white')
		// dynamictexture.drawText('Hello', undefined, 256, 'red')
		dynamicTexture1.drawTextCooked({
			text		: arr[x],
			lineHeight	: 0.5,
		});
        var i=0;

		var geometry = new THREE.PlaneGeometry( 300,400);
		var material = new THREE.MeshBasicMaterial( { color: 0xff0023 , map: THREE.ImageUtils.loadTexture('images/dog.jpeg')} );
		var mesh1 = new THREE.Mesh( geometry, material);
		mesh1.position.x=500;

		var geometry1 = new THREE.PlaneGeometry( 300,400);
		var material1 = new THREE.MeshBasicMaterial( { color: 0xff0012, map : dynamicTexture1.texture} );
		var mesh = new THREE.Mesh( geometry1, material1);
		mesh.position.x=-300;
		window["scene"+i] = new THREE.Scene();

		window["scene"+i].add(mesh);
		window["scene"+i].add(mesh1);
		mesh1.material.map.wrapS = THREE.RepeatWrapping; mesh1.material.map.repeat.x = -1;
       // window["renderer"+i].setClearColor(0xff00ff);
       
		function render()
		{
			requestAnimationFrame(render);
			if(mesh.position.x!=mesh1.position.x)
			{
				mesh.position.x+=1;
				mesh1.position.x-=1;

				//mesh.rotation.z+=0.05;
			}

           // mesh.rotation.z += .02;
            //mesh.rotation.y+=0.01;
            //mesh.rotation.x+=0.1;
			window["renderer"+i].render(window["scene"+i],window["camera"+i]);
		}
			render();
        if(x==y)
        {
        	return "YES";
        }
        else
        {
        	return "NO";
        }

    },

    areaperimeter : function(params)
    {
    	var x=params[0];
    	var y=params[1];
    	var z=params[2];
    	var x1=Math.floor(Math.random() * ( y - x + 1 )) + x;
    	var x2=Math.floor(Math.random() * ( y - x + 1 )) + x;
    	 var dynamicTexture	= new THREEx.DynamicTexture(512,512);
		dynamicTexture.context.font	= "bold "+(0.6*512)+"px Arial";
		dynamicTexture.clear('white')
		dynamicTexture.drawTextCooked({
			text		: "     "+String(x1)+"                                    		                       "+String(x2),
			lineHeight	: 0.1,
		});
        var i=0;

		var geometry = new THREE.PlaneGeometry( 300,400);
		var material = new THREE.MeshBasicMaterial( { color: 0xff0023, map : dynamicTexture.texture} );
		var mesh = new THREE.Mesh( geometry, material);
		
		
		window["scene"+i] = new THREE.Scene();

		window["scene"+i].add(mesh);
		
		//mesh1.material.map.wrapS = THREE.RepeatWrapping; mesh1.material.map.repeat.x = -1;
       
		function render()
		{
			requestAnimationFrame(render);
			
           // mesh.rotation.z += .02;
            //mesh.rotation.y+=0.01;
            //mesh.rotation.x+=0.1;
			window["renderer"+i].render(window["scene"+i],window["camera"+i]);
		}
			render();
        if(z==0)
        	return x1*x2;
        else
        	return 2*(x1+x2);

    },

    timeFormUtil : function(){
		var arr = apilib.clockUtil();
		var str = arr[0]+" : "+arr[1];
		return str;
	},
	timeConvert : function(params){
		var str = params[0]+" : "+params[1];
		return str;
	},
	clockUtil : function(){
		var hr = apilib.randInt([0,11]);
		var min = apilib.randInt([0,11])*5;
		return [hr,min];
	},
	drawClock : function(params){
		var group = new THREE.Object3D();
		var arr = params[0];
		var hr = arr[0];
		var min = arr[1];
		var angle_hr = Math.PI/2 -Math.PI*( 30*(hr+min/60))/180;
		var angle_min = Math.PI/2 -Math.PI*( 6*min)/180;
		var loader = new THREE.TextureLoader();
		var texture = loader.load( "../../media/images/clock.jpg" );
		var geometry = new THREE.CircleGeometry( 300, 100);
		var material = new THREE.MeshBasicMaterial( { map: texture} );
		var cube = new THREE.Mesh( geometry, material );
		group.add(cube);
		var dir_hr = new THREE.Vector3( Math.cos(angle_hr), Math.sin(angle_hr), 0 );
		var dir_min = new THREE.Vector3(Math.cos(angle_min), Math.sin(angle_min), 0);
		var origin = new THREE.Vector3( 0, 0, 0 );
		var hex = 0x000000;
		var arrowHelper_hr = new THREE.ArrowHelper( dir_hr, origin, 140, hex , 30 , 30);
		group.add( arrowHelper_hr );
		var arrowHelper_min = new THREE.ArrowHelper( dir_min, origin, 180, hex , 30 , 30);
		group.add( arrowHelper_min );
		scene0.add(group);
		cube.position.x = 0;
		cube.position.y = 0;
		cube.position.z = 0;
	},

    randSequence : function(params){
		var size = 5
		var arr= [];
		for(var i=0;i<size;i++)
		{
			var y = Math.floor(Math.random() * ( 100 - 1 + 1 )) + 1;
			arr.push(y);
		}

		//alert("disp" + arr);
		
		//themeArr = themeArr.push(arr);
		return arr;
	},
	ascending : function(arr){
		window.clearInterval(2000);
		var i, j, min_idx;
	    for (i = 0; i < arr.length-1; i++)
	    {
	        min_idx = i;
	        for (j = i+1; j < arr.length; j++)
	          if (arr[j] < arr[min_idx])
	            min_idx = j;
	 
	        var t = arr[i];
	        arr[i] = arr[min_idx];
	        arr[min_idx] = t;
	    }
	    var arr1=[];
	    arr1.push(arr);
	    return arr1;
	},
	descending : function(arr){
		var i, j, min_idx;
	    for (i = 0; i < arr.length-1; i++)
	    {
	        min_idx = i;
	        for (j = i+1; j < arr.length; j++)
	          if (arr[j] > arr[min_idx])
	            min_idx = j;
	 
	        var t = arr[i];
	        arr[i] = arr[min_idx];
	        arr[min_idx] = t;
	    }
	    return arr;
	},

	shuffleAscDesc : function(params)
	{
		var para = JSON.parse("[" + params + "]");
		var arr=[];
		var k=ascendingdescendingcounter ;
		var i;
		for(i=k;i<para.length;i++)
		{
			arr.push(para[i]);
		}
		for(i=0;i<k;i++)
		{
			arr.push(para[i]);
		}
		ascendingdescendingcounter++;
		if(ascendingdescendingcounter>4)
		{
			ascendingdescendingcounter=1;
		}
		return arr;
	},

	randDays : function(params){
		var arr = ['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday'];
		var x = apilib.randInt(params);
		return arr[x];
	},

	randMonths : function(params){
		var arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		var x = apilib.randInt(params);
		return arr[x];
	},
	identifyMonths : function(num){
		var arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		return arr[num-1];
	},
	predecessorDays : function(str)
	{	var x;
		var arr = ['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday'];
        for(var i = 0; i<=6; i++)
        {
        	if(str == arr[i]){
        		x = i;
        		break;
        	}
        }
        return arr[x-1];
	},
	successorDays : function(str)
	{
        var x;
		var arr = ['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday'];
        for(var i = 0; i<=6; i++)
        {
        	if(str == arr[i]){
        		x = i;
        		break;
        	}
        }
        return arr[x+1];
	},
	predecessorMonths : function(str)
	{
		var x;
		var arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        for(var i = 0; i<=11; i++)
        {
        	if(str == arr[i]){
        		x = i;
        		break;
        	}
        }
        return arr[x-1];
	},
	successorMonths : function(str)
	{
       var x;
		var arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        for(var i = 0; i<=11; i++)
        {
        	if(str == arr[i]){
        		x = i;
        		break;
        	}
        }
        return arr[x+1];
	},
	numMonths : function(str)
	{
       var x;
		var arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        for(var i = 0; i<=11; i++)
        {
        	if(str == arr[i]){
        		x = i;
        		break;
        	}
        }
        return x+1;
	},
	time0 : function(num){
		var x = num*60;
		console.log(x);
		return x;
	},
	time1 : function(num){
		var x = num*60*60;
		return x;
	},

	randVowelConso : function(params){
		var min = params[0];
		var max = params[1];
		return  String.fromCharCode(Math.floor(Math.random() * ( max - min + 1 )) + min+97);
	},

	randChar : function(params)
    {
       if(params.length > 1)
		{
			var num = apilib.randInt(params);
		}
		else
			var num = params[0];

		var x=String.fromCharCode(num);
		return x;
    },
    isPalindrome : function(num){
		var m=num;
		var rev=0;
		while(m>0)
		{
			rev= rev*10;
			var rem=m%10;
			rev+=rem;
			m=parseInt(m/10);
		}
		if(num==rev)
		{
			return "YES";
		}
		else
		{
			return "NO";
		}
	},
	isLeapYear : function(num){
		var p=1;
		if(num%4==0)
		{
			if(num%100==0 && num%400!=0)
			{
				p=0;
			}
		}	
		else
			p=0;
		if(p==1)
			return "YES";
		else
			return "NO"
	},

	convertupper : function(params)
	{
       var x=params.toUpperCase();
       return x;
	},
	convertlower : function(params)
	{
       var x=params.toLowerCase();
       return x;
	},
	predecessor : function(params)
	{
		para=String(params);
       var x=para.charCodeAt();
       x=x-1;
       var str=String.fromCharCode(x);
       return str;
	},
	successor : function(params)
	{
      para=String(params);
       var x=para.charCodeAt();
       x=x+1;
       var str=String.fromCharCode(x);
       return str;
	},

	convertcase : function(params){
		var nameArray = ["","A","B","C","D","E","F","G","H","I","J",
		"K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		if(params.length > 1)
		{
			var num = apilib.randInt(params);
		}
		else
			var num = params[0];
		
		return(nameArray[num]);
	},	
	convertcasel : function(params){
		var nameArray = ["","a","b","c","d","e","f","g","h","i","j",
		"k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		if(params.length > 1)
		{
			var num = apilib.randInt(params);
		}
		else
			var num = params[0];
		
		return(nameArray[num]);
	},	

    divTest : function(x,y)
    {
    	if(x%y==0)
    		return "YES"
    	else
    		return "NO"
    },

    caseConvert : function(params){
    
			if(params.length > 1)
		{
			var num = apilib.randChar(params);
		}
		else
			var num = params[0];
		return num.toUpperCase();

	},	

	comparison : function(num1, num2){
		if(num1 > num2)
			return "YES";
		else
			return "NO";
	},

	isPrime : function(num){
		if(num == 1)
			return "";
		for(var i = 2; i < num; i++) {
	        if(num % i === 0) {
	            return "Composite";
	        }
	    }
	    return "Prime";
	},
	generateNum : function(array, type){
		var num;
		if(type == "prime")
		{
			while(true)
			{
				num = apilib.randInt(array);
				if(num == 1)
					continue;
				if(apilib.isPrime(num)=="Prime")
					return num;
			}
		}
		else if(type == "composite")
		{
			while(true)
			{
				num = apilib.randInt(array);
				if(num == 1)
					continue;
				if((apilib.isPrime(num))=="Composite")
					return num;
			}
		}
	},
	generatePrimeComposite : function(params){
		var num;
		var quantity = params[0];
		var array = [], numArray = [];
		correctAns = [];
		array = [params[1], params[2]];
		var primeQuant = apilib.randInt([1, quantity]);
		var compositeQuant = quantity - primeQuant;
		correctAns.push(1);
		correctAns.push(quantity);
		for(var i = 0; i < primeQuant; i++)
		{
			repeat = false;
			num = apilib.generateNum(array, "prime");
			for(var j = 0; j < numArray.length; j++)
			{
				if(num == numArray[j]){
					repeat = true;
					i--;
					break;
				}
			}
			if(!repeat){
				numArray.push(num);
				correctAns.push(num);
				//console.log("PA1: "+primeArray);
			}
		}
		for(var i = 0; i < compositeQuant; i++)
		{
			repeat = false;
			num = apilib.generateNum(array, "composite");
			for(var j = 0; j < numArray.length; j++)
			{
				if(num == numArray[j]){
					repeat = true;
					i--;
					break;
				}
			}
			if(!repeat){
				numArray.push(num);
				correctAns.push(num);
				//console.log("PA2: "+primeArray);
			}
		}
		return correctAns;
	},

	isTwinPrime : function(params){
		var num1 = params[0];
		var num2 = params[1];
		if(apilib.isPrime(num1) == "Prime" && apilib.isPrime(num2) == "Prime")
		{
			if((num1 - num2 == 2) || (num2 - num1 == 2))
				return "YES";
		}
		else
			return "NO";
	},
	isCoPrime : function(params){
		var num1 = params[0];
		var num2 = params[1];
		var temp;
		if(num1 == 1 || num2 == 1)
			return "NO";
		while(num2!=0)
		{
			temp=num1%num2;
			num1=num2;
			num2=temp;
		}
		if(num1==1)
			return "YES";
		else
			return "NO";
	},
	findGcd : function(params){
		var num1 = params[0];
		var num2 = params[1];
		var gcd;
		for(var i=1; i <= num1 && i <= num2; ++i)
   	 	{
        if(num1%i==0 && num2%i==0)
            gcd = i;
   	 	}
    	return gcd;
	},
	findLcm : function(params){
		var num1 = params[0];
		var num2 = params[1];
		var gcd = apilib.findGcd(params);
		var lcm = num1*num2/gcd;
		return lcm;
	},
	lcmgcd : function(num1,num2,pdt){
		var x = num1*num2/pdt;
		return x;
	},

	placeValue : function(num){
		var place = [];
		var i = 0;
		while(num!=0){
			place[i] = num%10;
			num = Math.floor(num/10);
			i++;
		}
		return place;
	},
	zeros : function(num){
		var x;
		var count = 0;
		while(num>0)
		{
			x = num%10;
			if(x == 0){
				count++;
			}
			num = Math.floor(num/10);		
		}
		return count;
	},
	fracToPercent : function(correctAns){
		var a = eval(correctAns);
		a *= 100;
		if(Math.floor(a) === a)
			return a;
		else
			return a.toFixed(2);
	},

	checkIfPrime : function(array){
		var primeArray = [];
		for(var i = 0; i < array.length; i++)
		{
			if(apilib.isPrime(array[i]) == "Prime"){
				primeArray.push(array[i]);
			}
		}
		return primeArray;
	},

	checkIfComposite : function(array){
		var compositeArray = [];
		for(var i = 0; i < array.length; i++)
		{
			if(apilib.isPrime(array[i]) == "Composite"){
				compositeArray.push(array[i]);
			}
		}
		return compositeArray;
	},
	randLeadingZeros : function(params){
		var arr = ['0005','0050','0170','1748','0008','0009','8981','0801','8065','0746','0046','0400','9099','0084','0007','0040','9870','0175','0086','0001'];
		var x = apilib.randInt(params);
		//console.log(x);
		return arr[x];
	},
	leadingZeros : function(str){
		//num = parseInt(s);
		var i;
		var count = 0;
		for(i = 0; i<str.length; i++){
			var x = str.charAt(i);
			if(x == "0")
				{count++;
					console.log(i +":"+count);}
			else
				break;
		}
		return count;
	},
	trailingZeros : function(num){
		var x;
		var count = 0;
		while(num>0)
		{
			x = num%10;
			if(x == 0){
				count++;
			}
			else
				break;
			num = Math.floor(num/10);		
		}
		return count;
	},

	randRhymingWords : function(params){
		var rhy = new Array();
		rhywordIndex = apilib.randInt(params);
		for (i=0;i<=20;i++) 
 			rhy[i]=new Array();
 		rhy[0] = ["bat","rat","cat"];
 		rhy[1] = ["cat","fan","man"];
 		rhy[2] = ["dam","jam","ham"];
 		rhy[3] = ["bat","dig","can"];
 		rhy[4] = ["hen","ten","pen"];
 		rhy[5] = ["fly","man","shy"];
 		rhy[6] = ["beg","peg","leg"];
 		rhy[7] = ["son","dog","hop"];
 		rhy[8] = ["jet","get","bet"];
 		rhy[9] = ["ben","ten","and"]; 		
 		rhy[10] = ["back","sack","pack"];
 		rhy[11] = ["hate","said","told"];
 		rhy[12] = ["nail","sail","rail"];
 		rhy[13] = ["bill","cake","wing"];
 		rhy[14] = ["hill","bill","pill"];
 		rhy[15] = ["hale","rail","sold"];
 		rhy[16] = ["bake","cake","fake"];
 		rhy[17] = ["find","text","view"];
 		rhy[18] = ["sing","wing","ring"];
 		rhy[19] = ["gold","sole","face"];
 		rhy[20] = ["gold","hold","sold"];
 		return rhy[rhywordIndex];
	},

	checkRhyming : function(){
		var x = rhywordIndex%2;		
		if(x==0)
			return "YES";
		else
			return "NO"; 
	},

	countOddEven : function(array){
		countOddEven = 0;
		for(var i = 0; i < array.length; i++)
		{
			if(level == 2 && apilib.oddEven(array[i]) == "Odd")
				countOddEven++;
			if(level == 3 && apilib.oddEven(array[i]) == "Even")
				countOddEven++;
		}
		return countOddEven;
	},

	countPrimeComp : function(array){
		countPrimeComp = 0;
		for(var i = 0; i < array.length; i++)
		{
			if(level == 2 && apilib.isPrime(array[i]) == "Prime")
				countPrimeComp++;
			if(level == 3 && apilib.isPrime(array[i]) == "Composite")
				countPrimeComp++;
		}
		return countPrimeComp;
	},

	vowelConso : function(num){

		if(num=='a'||num=='e'||num=='i'||num=='o'||num=='u')
			return "Vowel";
		return "Consonant";
	},

	oddEven : function(num){
		if(num%2==0)
			return "Even";
		return "Odd";
	},
	randIntSub : function(params){
		if(rendererCount == s[s.length-1].rendererCount)
			rendererCount = 0;
		window["num"+rendererCount] = apilib.randInt(params);
		while(num0 == params[0]){
			num0 = apilib.randInt(params);
		}
		if(rendererCount >= 1)
		{
			while(window["num"+rendererCount] >= window["num"+(rendererCount-1)]){
				window["num"+rendererCount] = apilib.randInt(params);
			}
		}
		return window["num"+rendererCount];
	},
	randIntDiv : function(params){
		if(rendererCount == s[s.length-1].rendererCount)
			rendererCount = 0;
		window["num"+rendererCount] = apilib.randInt(params);
		if(rendererCount >= 1)
		{
			var n = window["num"+(rendererCount-1)];
			var narray = [];
			var length=0;
			for(var i=1;i<=n;i++)
			{
				if(n%i==0)
				{
					 narray.push(i);
					 length++;
				}
				console.log(narray[i]+" ");
			}
			var t= length-1;
			var k = apilib.randInt([0,t]);
			window["num"+rendererCount]=narray[k];
			console.log(window["num"+rendererCount]);
		}
		
		return window["num"+rendererCount];
	},
	getRandomColor : function(){
		var letters = '0123456789ABCDEF'.split('');
	    var color1 = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color1 += letters[Math.floor(Math.random() * 16)];
	    }
	    return color1;
	},
	decimalToHex : function( d ) {
		var hex = Number( d ).toString( 16 );
		hex = "000000".substr( 0, 6 - hex.length ) + hex;
		return hex.toUpperCase();
	},
	drawText : function(params){
		var flag = params[1];
		if(flag == 0)
		{
			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
			THREE.Cache.enabled = true;
			var container, hex, color;
			var cameraTarget
			var group, textMesh1, textMesh2, textGeo, material;
			var firstLetter = true;
			var mirror=true;
			var text = params[0],height = 20,size = params[3],hover = 30,curveSegments = 4,bevelThickness = 1,bevelSize = 0.01,bevelSegments = 0.03,bevelEnabled = false,font = undefined,fontName = "optimer",fontWeight = "bold";
			var fontMap = {"helvetiker": 0,"optimer": 1,"gentilis": 2,"droid/droid_sans": 3,"droid/droid_serif": 4};
			var weightMap = {"regular": 0,"bold": 0};
			var fontIndex = 1;
			cameraTarget = new THREE.Vector3( 0, 100, 0 );
			var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
			pointLight.position.set( 0, 0, 90 );
			if(params[2] == "sceneL")
			{
				sceneL.add( pointLight );
				pointLight.color.setHSL( Math.random(), 1, 0.5 );
				var hex = apilib.decimalToHex( pointLight.color.getHex() );
				material = new THREE.MultiMaterial( [
					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading}),
					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading})]);
				group = new THREE.Group();
				group.position.y = -50;
				sceneL.add( group );
				var loader = new THREE.FontLoader();
				loader.load( '../../media/fonts/'+fontName + '_' + fontWeight + '.typeface.js', function ( response ) {
					font = response;
					group.remove( textMesh1 );
					if ( !text ) return;
					textGeo = new THREE.TextGeometry( text, {font: font,size: size,height: height,curveSegments: curveSegments,bevelThickness: bevelThickness,bevelSize: bevelSize,bevelEnabled: bevelEnabled,material: 0,extrudeMaterial: 1});
				textGeo.computeBoundingBox();
				textGeo.computeVertexNormals();
				var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
				textMesh1 = new THREE.Mesh( textGeo, material );
				textMesh1.position.x = centerOffset;
				textMesh1.position.y = hover;
				textMesh1.position.z = 0;
				textMesh1.rotation.x = 0;
				textMesh1.rotation.y = Math.PI * 2;
				group.add( textMesh1);});
			}
			else if(params[2] == "sceneK")
			{
				var i = 0;
				function image(){
					window["renderer"+i].setClearColor( 0xffffff );
					var light = new THREE.AmbientLight(0xffffff, 1);
					window["scene"+i].add(light);
					light.position.set(0,60,60);
					light = new THREE.DirectionalLight(0xffffff, 0.2);
					window["scene"+i].add(light);
					light.position.set(0,60,60);
					var geometry = new THREE.BoxGeometry( 500,500, 0.1 );
					if(params[0] == "correct")
			        	var texture = new THREE.TextureLoader().load( "../../media/images/correct.png" );
			        else if(params[0] == "wrong")
			        	var texture = new THREE.TextureLoader().load( "../../media/images/wrong.png" );
			        else
			        	var texture = new THREE.TextureLoader().load("../../media/images/CLU.png");


					var material = new THREE.MeshBasicMaterial( { map: texture } );
					var cube = new THREE.Mesh( geometry, material );
					window["scene"+i].add( cube);
					if(i < rendererCount)
						setTimeout(function(){
							i++;
							image();
						},0);
					else
						return;
				}
				image();
			}
			else
			{
				var mytext,flagArray;
				if(Array.isArray(text)){
					mytext = text.toString();
					flagArray = 1;
				}
				window["scene"+rendererCount].add( pointLight );
				pointLight.color.setHSL( Math.random(), 1, 0.5 );
				var hex = apilib.decimalToHex( pointLight.color.getHex() );
				material = new THREE.MultiMaterial( [
					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading}),
					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading})]);
				group = new THREE.Group();
				group.position.y = -50;
				window["scene"+rendererCount].add( group );
				var loader = new THREE.FontLoader();
				loader.load( '../../media/fonts/'+fontName + '_' + fontWeight + '.typeface.js', function ( response ) {
				font = response;
				group.remove( textMesh1 );
				if ( !text ) return;
			//	console.log(mytext);
				
				if(flagArray == 1)
					textGeo = new THREE.TextGeometry( mytext, {font: font,size: size,height: height,curveSegments: curveSegments,bevelThickness: bevelThickness,bevelSize: bevelSize,bevelEnabled: bevelEnabled,material: 0,extrudeMaterial: 1});
				else
					textGeo = new THREE.TextGeometry( text, {font: font,size: size,height: height,curveSegments: curveSegments,bevelThickness: bevelThickness,bevelSize: bevelSize,bevelEnabled: bevelEnabled,material: 0,extrudeMaterial: 1});
				textGeo.computeBoundingBox();
				textGeo.computeVertexNormals();
				var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
				textMesh1 = new THREE.Mesh( textGeo, material );
				textMesh1.position.x = centerOffset;
				textMesh1.position.y = hover;
				textMesh1.position.z = 0;
				textMesh1.rotation.x = 0;
				textMesh1.rotation.y = Math.PI * 2;
				group.add( textMesh1 );});
				rendererCount++;
				if(rendererCount == s[s.length-1].rendererCount)
					rendererCount = 0;
			}			
		}
	},

	mineSweeperMemoryArray : function(params){
		var mineArray = [];
		var count = params[0];
		for(var i = 1; i <=count; i++)
		{
			mineArray[i - 1] = String(i);
		}
		for(var i = count; i < 9; i++)
		{
			mineArray[i] = "";
		}
		return mineArray;
	},

	mineSweeper : function(params){
		var objectlist1=[];
		var objectlist2=[];
		var targetList = [];
		var ranNums=[];
		var ids=[];
		camera0.position.z=150;
		var projector, mouse = { x: 0, y: 0 };
		var geometry = new THREE.PlaneGeometry( 50,50);
		var inity=-40;
		var arr=params[0];
		var i = arr.length;
	    var j = 0;
		while (i--) {
		    j = Math.floor(Math.random() * (i+1));
		    ranNums.push(arr[j]);
		    arr.splice(j,1);
		}
		var cnt=1;
		while(cnt<=3)
		{
			for(i=0;i<ranNums.length;i++)
			{
				if(ranNums[i]==cnt.toString())
				{
					ids.push(i);
				}	
			}
			cnt++;
		}	
		var k=0;
		for(i=0;i<3;i++)
		{
			var init=-40;
			var inc=50;
			for(j=0;j<3;j++)
			{
				var dynamicTexture    = new THREEx.DynamicTexture(512,512);	
		    	dynamicTexture.context.font    = "bold "+(0.2*512)+"px Arial";
		    	dynamicTexture.texture.anisotropy = renderer0.getMaxAnisotropy()
		    	dynamicTexture.clear('yellow')	
				dynamicTexture.drawTextCooked({
		        text        : ranNums[k].toString(),
		        lineHeight    : 0.2,
			    });
				k++;
				if(j%2==0)
				{
					if(i!=1)
					var material = new THREE.MeshBasicMaterial( { color: 0xff0000, map : dynamicTexture.texture} );
					else
					var material = new THREE.MeshBasicMaterial( { color: 0xffff00, map : dynamicTexture.texture } );		
				}		
				else
				{
					if(i!=1)
					var material = new THREE.MeshBasicMaterial( { color: 0xffff00, map : dynamicTexture.texture } );
					else
					var material = new THREE.MeshBasicMaterial( { color: 0xff0000 , map : dynamicTexture.texture} );	
				}
				var object = new THREE.Mesh( geometry, material);
				object.position.x=init+inc;
				object.position.y=inity;
				init=init+inc;
				scene0.add(object);
				objectlist1.push(object);
				}
				inity=inity+50;
		}	
		inity=-40;
		for(i=0;i<3;i++)
		{
			var init=-300;
			var inc=50;
			for(j=0;j<3;j++)
			{
				var dynamicTexture    = new THREEx.DynamicTexture(512,512);	
		    	dynamicTexture.context.font    = "bold "+(0.2*512)+"px Arial";
		    	dynamicTexture.texture.anisotropy = renderer0.getMaxAnisotropy()
		    // update the text
		    	dynamicTexture.clear('yellow')	
				dynamicTexture.drawTextCooked({
		        text        : "",
		        lineHeight    : 0.2,
		    	});
				
				if(j%2==0)
				{
					if(i!=1)
					var material = new THREE.MeshBasicMaterial( { color: 0xff0000, map : dynamicTexture.texture} );
					else
					var material = new THREE.MeshBasicMaterial( { color: 0xffff00, map : dynamicTexture.texture } );		
				}		
				else
				{
					if(i!=1)
					var material = new THREE.MeshBasicMaterial( { color: 0xffff00, map : dynamicTexture.texture } );
					else
					var material = new THREE.MeshBasicMaterial( { color: 0xff0000 , map : dynamicTexture.texture} );	
				}
				var object = new THREE.Mesh( geometry, material);
				object.position.x=init+inc;
				object.position.y=inity;
				object.position.z=2;
				init=init+inc;
				scene0.add(object);
				objectlist2.push(object);
			//	targetList.push(object);		
			}
			inity=inity+50;
		}		
		projector = new THREE.Projector();
		document.addEventListener( 'mousedown', onDocumentMouseDown_mineSweeper, false );
		var mycount=0;	
		animate();
		function cursorPositionInCanvas(canvas, event) {
	        var x, y;
	        canoffset = $(canvas).offset();
	        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - 
	        							Math.floor(canoffset.left);
	        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - 
	        							Math.floor(canoffset.top) + 1;

	        return [x,y];
		}
		function onDocumentMouseDown_mineSweeper( event ) 
		{
			console.log("Click.");
			mouse.x = ((cursorPositionInCanvas( renderer0.domElement, event )[0]) / $(canvas).width()) * 2 - 1;
			mouse.y = - ((cursorPositionInCanvas( renderer0.domElement, event )[1])/ $(canvas).height()) * 2 + 1;
			var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			projector.unprojectVector( vector, camera0 );
			var ray = new THREE.Raycaster( camera0.position, vector.sub( camera0.position ).normalize() );
			var intersects = ray.intersectObjects( targetList );
			if ( intersects.length > 0 )
			{
				var str=intersects[0].object.material.map.id;
				console.log(ranNums[str]);
				if(str!=ids[mycount])
				{
					alert("wrong");
					assessmentCount_negative++;
					var str = "wrong";

					for(i=0;i<targetList.length;i++)
					{
						targetList[i].position.z=4;
					}
					myVar = setTimeout(myfun, 1000);
				}
				else
				{
					alert("correct");
					var dynamicTexture    = new THREEx.DynamicTexture(512,512);	
			    	dynamicTexture.context.font    = "bold "+(0.2*512)+"px Arial";
			    	dynamicTexture.texture.anisotropy = renderer0.getMaxAnisotropy()
			    	dynamicTexture.clear('yellow')	
					dynamicTexture.drawTextCooked({
			        text        : ranNums[str].toString(),
			        lineHeight    : 0.2,
			    	});
					console.log("Hit @ " + toString( intersects[0].point ) );
					//alert("hello");
					var posx=intersects[0].object.position.x;
					var posy=intersects[0].object.position.y;
					/*var geometry = new THREE.PlaneGeometry( 50,50);
					var material = new THREE.MeshBasicMaterial( { color: 0xffff00, map : dynamicTexture.texture } );
					intersects[0].object= new  THREE.Mesh( geometry, material);*/
					//intersects[0].object.material.color=0xffffff;
					intersects[0].object.position.x=posx;
					intersects[0].object.position.y=posy;
					intersects[0].object.position.z=4;
					intersects[0].object.material.map=dynamicTexture.texture;	
					mycount++;
					if(mycount==3)
					{
						alert("game won!!!!!!!!!!!");	
					}
				}
			}
		}
		function myfun()
		{
			alert("game over");
		}
		function toString(v) { return "[ " + v.x + ", " + v.y + ", " + v.z + " ]"; }
		var p=0;
		function animate() 
		{
		    requestAnimationFrame( animate );

		    for(var k=0;k<objectlist1.length;k++)
		    {
		        if(objectlist2[k].position.x!=objectlist1[k].position.x)
		        {
		            objectlist2[k].position.x+=1;
		        }
		         if(objectlist2[k].position.x==objectlist1[k].position.x && p<10)
		        {
		            targetList.push(objectlist1[k]);    
		            p++;
		        }
		        
		    }
			render();		
		}
		function render() 
		{
			renderer0.render( scene0, camera0 );
		}
	},

	demoAdd : function(){
		var controls, mat, gag=0;
		var sphere1, sphere2, rad = [];
		var Mov1X ,Mov1Y, Mov2X ,Mov2Y, flag1X, flag1Y, flag2X, flag2Y, i=5, flag=0, j=0;

		function init() {/*
			controls = new THREE.OrbitControls( camera, renderer0.domElement );
			controls.addEventListener( 'change', render );*/
			camera0.position.z = 100;
			dynamicTexture	= new THREEx.DynamicTexture(512,512);
			dynamicTexture.context.font	= "bolder 260px Verdana";
			var geo = new THREE.CircleBufferGeometry(5,32,32);
			var no;
			no = Math.floor(Math.random()*10+1);
			dynamicTexture.clear('cyan')
			.drawText(no, undefined, 256, 'red')
			rad.push(no);
			mat = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, map: dynamicTexture.texture });
			sphere1 = new THREE.Mesh(geo, mat);
			scene0.add(sphere1);
			no = Math.floor(Math.random()*10+1);
			dynamicTexture	= new THREEx.DynamicTexture(512,512);
			dynamicTexture.context.font	= "bolder 260px Verdana";
			dynamicTexture.clear('cyan')
			.drawText(no, undefined, 256, 'red')
			mat1 = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, map: dynamicTexture.texture });
			sphere2 = new THREE.Mesh(geo, mat1);
			rad.push(no);
			
			scene0.add(sphere2);
			sphere1.position.set(100,Math.random()*10,0);
			sphere2.position.set(-100,Math.random()*10,0);
			Mov1X = Math.random()*5;
			Mov1Y = Math.random()*5;
			Mov2X = Math.random()*5;
			Mov2Y = Math.random()*5;
			flag1X = true;
			flag2X = false;
			flag1Y = true;
			flag2Y = false;	        	
			timeout();
		}
		function timeout(){
			setTimeout(function(){
				Mov1X = Math.random()*5;
				Mov1Y = Math.random()*5;
				Mov2X = Math.random()*5;
				Mov2Y = Math.random()*5;
				timeout();
			},4000);
		}
		function animate(){
			requestAnimationFrame(animate);
			if(j==0)
			{
				setTimeout(function(){flag=1;j=1;},1500);
			}
			if(flag==1)
			{
				if(sphere1.position.x  + i < 136 && flag1X == true)		
				{
					sphere1.position.x += Mov1X;
				}
				else
				{
					flag1X = false;
				}
				if(sphere1.position.x  - i > -138 && flag1X == false)		
				{
					sphere1.position.x -= Mov1X;
				}
				else
				{
					flag1X = true;
				}
			
				if(sphere2.position.x + 5 < 135 && flag2X == true)		
				{
					sphere2.position.x += Mov2X;
				}
				else
				{
					flag2X = false;
				}
				if(sphere2.position.x - 5 > -140 && flag2X == false)		
				{
					sphere2.position.x -= Mov2X;
				}
				else
				{
					flag2X = true;
				}
			
				if(sphere1.position.y  + i < 70 && flag1Y == true)		
				{
					sphere1.position.y += Mov1Y;
				}
				else
				{
					flag1Y = false;
				}
				if(sphere1.position.y - i > -68 && flag1Y == false)		
				{
					sphere1.position.y -= Mov1Y;
				}
				else
				{
					flag1Y = true;
				}
			
				if(sphere2.position.y + 5 < 71 && flag2Y == true)		
				{
					sphere2.position.y += Mov2Y;
				}
				else
				{
					flag2Y = false;
				}
				if(sphere2.position.y - 5 > -68 && flag2Y == false)		
				{
					sphere2.position.y -= Mov2Y;
				}
				else
				{
					flag2Y = true;
				}
			
				if(	(
						Math.abs(sphere1.position.x - sphere2.position.x) < i+5
					)
					 && 
					(
						Math.abs(sphere1.position.y - sphere2.position.y) < i+5 
					))
				{
					flag1X = !flag1X;
					flag2X = !flag2X;
					flag1Y = !flag1Y;
					flag2Y = !flag2Y;
					no = Math.floor(Math.random()*10+1);
					//var geo = new THREE.CircleBufferGeometry(,32,32);
					//sphere1 = new THREE.Mesh(geo, mat);
					scene0.remove(sphere1);
					scene0.remove(sphere2);
					var geo5 = new THREE.CircleBufferGeometry(5,32,32);
					dynamicTexture	= new THREEx.DynamicTexture(512,512);
					dynamicTexture.context.font = "bolder 260px Verdana";
					var mat5 = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, map: dynamicTexture.texture });
					sphere2 = new THREE.Mesh(geo5, mat5);
					dynamicTexture.clear('cyan')
					.drawText(no, undefined, 256, 'red')
					scene0.add(sphere2);
				
					var geo2 = new THREE.CircleBufferGeometry(i+rad[1]/2,100,100);
					dynamicTexture	= new THREEx.DynamicTexture(512,512);
					dynamicTexture.context.font = "bolder 260px Verdana";
					var mat2 = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, map: dynamicTexture.texture });
					sphere1 = new THREE.Mesh(geo2, mat2);
					dynamicTexture.clear('cyan')
					.drawText(rad[0]+rad[1], undefined, 256, 'red')
					if(sphere2.position.x + 100 < 140 && gag == 0)
					{
						sphere1.position.set(sphere2.position.x + 100,Math.random()*((70-(rad[0]+rad[1]))-(-70+(rad[0]+rad[1]))+1)+(-70+(rad[0]+rad[1])),0);
						gag = 1;
					}
					else if(sphere2.position.x - 100 > -140 && gag == 1)
					{
						sphere1.position.set(sphere2.position.x - 100,Math.random()*((70-(rad[0]+rad[1]))-(-70+(rad[0]+rad[1]))+1)+(-70+(rad[0]+rad[1])),0);
						gag = 0;
					}
					scene0.add(sphere1);
					rad[0] += rad[1];
					rad[1] = no;
					i += rad[1]/2;
					flag=0;
					if(rad[0]>=50)
					{
						flag=0;
					}
					else
					{
						setTimeout(function(){flag=1;},1500);
					}
				}
			}
			else if(rad[0]>=50)
			{
				no = Math.floor(Math.random()*10+1);
				rad[0] = no;
				scene0.remove(sphere1);
				scene0.remove(sphere2);
				var geo5 = new THREE.CircleBufferGeometry(5,32,32);
				dynamicTexture	= new THREEx.DynamicTexture(512,512);
				dynamicTexture.context.font = "bolder 260px Verdana";
				var mat5 = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, map: dynamicTexture.texture });
				sphere2 = new THREE.Mesh(geo5, mat5);
				dynamicTexture.clear('cyan')
				.drawText(no, undefined, 256, 'red')
				scene0.add(sphere2);
				no = Math.floor(Math.random()*10+1);
				rad[1] = no;
				var geo2 = new THREE.CircleBufferGeometry(5,100,100);
				dynamicTexture	= new THREEx.DynamicTexture(512,512);
				dynamicTexture.context.font = "bolder 260px Verdana";
				var mat2 = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, map: dynamicTexture.texture });
				sphere1 = new THREE.Mesh(geo2, mat2);
				dynamicTexture.clear('cyan')
				.drawText(no, undefined, 256, 'red')
				if(sphere2.position.x + 100 < 140 && gag == 0)
				{
					sphere1.position.set(sphere2.position.x + 100,Math.random()*((70-(rad[0]+rad[1]))-(-70+(rad[0]+rad[1]))+1)+(-70+(rad[0]+rad[1])),0);
				}
				else if(sphere2.position.x - 100 > -140 && gag == 1)
				{
					sphere1.position.set(sphere2.position.x - 100,Math.random()*((70-(rad[0]+rad[1]))-(-70+(rad[0]+rad[1]))+1)+(-70+(rad[0]+rad[1])),0);
				}
				scene0.add(sphere1);
				i = 5;
				setTimeout(function(){flag=1;},1500);
			}
			render();
			
		}
		function render() {
			renderer0.render( scene0, camera0 );
		}

		init();
		animate();
	},

	randomize : function(params){
		var n = params[0];
		objectIndex = params[1];
		var obj = JSON.parse(eval(t[objectIndex].name));
		var func = obj[0].functions[0].functionName;
		var width=160;
		var height=160;
		var protect = 0;
		var i = 0;
		objects = [];
		while(i < n)
		{     
			var object = window["apilib"][func](obj[0].functions[0].params);
		    object.position.x = Math.random() * 1000 - 500;
		    object.position.y = Math.random() * 600 - 300;
		    var overlapping=false;
			for(var j = 0;j < objects.length;j++)
			{
				var other=objects[j];
				if(!(object.position.x>other.position.x+width||object.position.x+width<other.position.x
					||object.position.y>other.position.y+width||object.position.y+height<other.position.y)){
				    overlapping=true;
					i--;
					break;
				}   
				          
			}
			if(!overlapping){
				objects.push(object);
			}
			protect++;
			if(protect>1000)
				break;
			i++;
		}
		if(rendererCount == s[s.length-1].rendererCount)
			rendererCount = 0;
		for(var i=0;i<objects.length;i++){
		  	window["scene"+rendererCount].add(objects[i]);
		}
		rendererCount++;
	},

	objectRenderer : function(params){
		var objectIndex = params[0];
		var obj = JSON.parse(eval(t[objectIndex].name));
		var object = apilib.evalFunc(obj[0].functions[0].functionName,obj[0].functions[0].params);
	    for(var i = 0; i < object.length; i++)
	    {	
	    	object[i].position.x = 0;
		    object[i].position.y = 0;
			if(rendererCount == s[s.length-1].rendererCount)
				rendererCount = 0;
			window["scene"+rendererCount].add(object[i]);
			rendererCount++;
	   	}
	},
//Arithmetic Functions
	operate : function(operation){
		switch(operation[0]){
			case 0:
				return "counting";
			case 1:
				return "add";
			case 2:
				return "mul";
			case 3:
				return "sub";
			case 4:
				return "iNum";
			case 5:
				return "oddEven";
			case 6:
				return "primeComposite";
			case 7:
				return "iName";
			case 8:
				return "coprime";
			case 9:
				return "twinprime";
			case 10:
				return "gcd";
			case 11:
				return "lcm";
			case 12:
				return "primeClickable";
			case 13:
				return "property";
			case 14:
				return "placeValue";
			case 15:
				return "numberComp";
			case 16:
				return "mazeAdd";
			case 17:
				return "pickNumEvenOdd";
			case 18:
				return "pickNumCountEvenOdd";
			case 19:
				return "pickNumPrimeComp";
			case 20:
				return "pickNumCountPrimeComp";
			case 21:
				return "zeros";
			case 22:
				return "leadingZeros";
			case 23:
				return "trailingZeros";
			case 24:
				return "caseupper"
			case 25:
				return "caselower"
			case 26:
				return "predecessor"
			case 27:
				return "successor"
			case 28:
				return "palindrome"
			case 29:
				return "leapyear"
			case 30:
				return "divisibilitytest"
			case 31:
				return "vowelsConso"
			case 33:
				return "numLineAdd"
			case 34:
				return "compositeClickable"
			case 35:
				return "fracToPercent"
			case 36:
				return "coloridentification"
			case 37:
				return "mirrorimage"
			case 38:
				return "areaperimeter"
			case 39:
				return "edgeCount"
			case 40:
				return "shapeidentification"
			case 41:
				return "mazeWordToNum"
			case 42:
				return "numLineSub"
			case 43:
				return "ascending";
			case 44:
				return "descending";
			case 45:
				return "FracAdd";
			case 46:
				return "FracMul";
			case 47:
				return "FracDiv";
			case 48:
				return "FracSub";
			case 49:
				return "vertexCount";
			case 50:
				return "mineSweeperMemory";
			case 51:
				return "timeCalculate"
			case 52:
				return "rhyming";
			case 53:
				return "identifyMonths";
			case 54:
				return "predecessorDays";
			case 55:
				return "successorDays";
			case 56:
				return "predecessorMonths";
			case 57:
				return "successorMonths";
			case 58:
				return "numMonths";
			case 59:
				return "time0";
			case 60:
				return "time1";
			case 61:
				return "div";
			case 62:
				return "numLineSuc"
			case 63:
				return "numLinePred" 
			case 64:
				return "numLineCo"
		}
	},

	calculate : function(correctAnsArray,operation){
		switch(operation)
		{
			case "counting":
				break;
			case "add":
				var num = correctAnsArray[0] + correctAnsArray[1];
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "mul":
				var num = correctAnsArray[0] * correctAnsArray[1];
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "sub":
				var num = correctAnsArray[0] - correctAnsArray[1];
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "iNum":
				correctAnsArray[0] = apilib.numToName(correctAnsArray);
				break;
			case "oddEven":
				correctAnsArray[0] = apilib.oddEven(correctAnsArray[0]);
				break;
			case "primeComposite":
				correctAnsArray[0] = apilib.isPrime(correctAnsArray[0]);
				break;
			case "iName":
				correctAnsArray[0] = apilib.nameToNum(correctAnsArray[0]);
				break;
			case "coprime":
				alert(correctAnsArray[0])
				var num = apilib.isCoPrime(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "twinprime":
				var num = apilib.isTwinPrime(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "gcd":
				var num = apilib.findGcd([correctAnsArray[0], correctAnsArray[1]]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "lcm":
				var num = apilib.findLcm([correctAnsArray[0], correctAnsArray[1]]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "property":
				var num = apilib.lcmgcd(correctAnsArray[0], correctAnsArray[1], 
						apilib.findLcm([correctAnsArray[0], correctAnsArray[1]]));
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "mazeAdd":
				var num = circleCount + correctAnsArray[0];
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "pickNumEvenOdd":
				correctAnsArray[0] = apilib.oddEven(correctAnsArray[0]);
				break;
			case "pickNumPrimeComp":
				correctAnsArray[0] = apilib.isPrime(correctAnsArray[0]);
				break;
			case "pickNumCountEvenOdd":
				correctAnsArray[0] = apilib.countOddEven(correctAnsArray[0]);
				break;
			case "pickNumCountPrimeComp":
				correctAnsArray[0] = apilib.countPrimeComp(correctAnsArray[0]);
				break;	
			case "numberComp":
				var num = apilib.comparison(correctAnsArray[0], correctAnsArray[1]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "zeros":
				var num = apilib.zeros(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "placeValue":
				var num = apilib.placeValue(correctAnsArray[0]);
				correctAnsArray = [];
				for(var i =0; i<num.length;i++)
					correctAnsArray.push(num[i]);
			case "leadingZeros":
				var num = apilib.leadingZeros(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "trailingZeros":
				var num = apilib.trailingZeros(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "predecessor":
		    	correctAnsArray[0]=apilib.predecessor(correctAnsArray[0]);
		    	break;
			case "successor":
				correctAnsArray[0]=apilib.successor(correctAnsArray[0]);
				break;
			case "palindrome":
				correctAnsArray[0] = apilib.isPalindrome(correctAnsArray[0]);
			    break;
			case "leapyear":
				correctAnsArray[0]= apilib.isLeapYear(correctAnsArray[0]);
				break;
			case "divisibilitytest":
				correctAnsArray[0]=apilib.divTest(correctAnsArray[0],correctAnsArray[1]);
				break;
			case "caseupper":
			    correctAnsArray[0]=apilib.convertupper(correctAnsArray[0]);
			     break;
			case "caselower":
				correctAnsArray[0]=apilib.convertlower(correctAnsArray[0]);
					break;
			case "vowelsConso":
			    correctAnsArray[0]=apilib.vowelConso(correctAnsArray[0]);
			case "fracToPercent":
				correctAnsArray[0]=apilib.fracToPercent(correctAnsArray[0]);
				break;
			case "shapeidentification":
				correctAnsArray[0]=apilib.shapeToName(correctAnsArray[0]);
				break;
			case "coloridentification":
				correctAnsArray[0]=apilib.colorToName(color);
				break;
			case "mirrorimage":
				break;
			case "areaperimeter":
				break;
			case "edgeCount":
				correctAnsArray[0]=apilib.shapeToEdge(correctAnsArray[0]);
				break;
			case "vertexCount":
				correctAnsArray[0]=apilib.shapeToVertex(correctAnsArray[0]);
				break;
			case "ascending":
				var num = apilib.ascending(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "descending":
				var num = apilib.descending(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "primeClickable":
				var num = correctAnsArray[0];
				correctAnsArray = [];
				correctAnsArray = apilib.checkIfPrime(num);
				break;
			case "compositeClickable":
				var num = correctAnsArray[0];
				correctAnsArray = [];
				correctAnsArray = apilib.checkIfComposite(num);
				break;
			case "mineSweeperMemory":
				break;
			case "FracAdd":
				var num = apilib.FracAdd(correctAnsArray[0], correctAnsArray[1]);
				correctAnsArray=[];
				correctAnsArray.push(num);
				break;
			case "FracMul":
				var num = apilib.FracMul(correctAnsArray[0], correctAnsArray[1]);
				correctAnsArray=[];
				correctAnsArray.push(num);
				break;
			case "FracDiv":
				var num = apilib.FracDiv(correctAnsArray[0], correctAnsArray[1]);
				correctAnsArray=[];
				correctAnsArray.push(num);
				break;
			case "FracSub":
				var num = apilib.FracSub(correctAnsArray[0], correctAnsArray[1]);
				correctAnsArray=[];
				correctAnsArray.push(num);
			case "mazeWordToNum":
				break;
			case "timeCalculate":
				correctAnsArray[0] = apilib.timeConvert(correctAnsArray[0]);
				break;
			case "identifyMonths":
				var num = apilib.identifyMonths(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "numMonths":
				var num = apilib.numMonths(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "predecessorMonths":
				var num = apilib.predecessorMonths(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "predecessorDays":
				var num = apilib.predecessorDays(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "successorDays":
				var num = apilib.successorDays(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "successorMonths":
				var num = apilib.successorMonths(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "time0":
				var num = apilib.time0(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "time1":
				var num = apilib.time1(correctAnsArray[0]);
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "rhyming":
				var num = apilib.checkRhyming();
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "div":
				correctAnsArray.push(correctAnsArray[0]/correctAnsArray[1]);
				break;
			case "numLineAdd":
				var num = correctAnsArray[0][0] + correctAnsArray[0][1];
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "numLineSub":
				var num = correctAnsArray[0][0] - correctAnsArray[0][1];
				correctAnsArray = [];
				correctAnsArray.push(num);
				break;
			case "numLineSuc":
				correctAnsArray[0]++;
				break;
			case "numLinePred":
				correctAnsArray[0]--;
				break;
			case "numLineCo":
				var num = apilib.findGcd([correctAnsArray[0][0], correctAnsArray[0][1]]);
				correctAnsArray.length=1;
				correctAnsArray[0]= num;
		}
		return correctAnsArray;
	},


//Functions for rendering the objects
	drawCandy1Random : function(){
		var geometry = new THREE.CircleGeometry( 80, 4 );
		var texture = new THREE.TextureLoader().load( "../../media/images/candy1.png" );
		var material = new THREE.MeshBasicMaterial( { map : texture } );
		var circle = new THREE.Mesh( geometry, material );
		return circle;
	},
	drawCandy2Random : function(){
		var geometry = new THREE.CircleGeometry( 80, 4 );
		var texture = new THREE.TextureLoader().load( "../../media/images/candy2.png" );
		var material = new THREE.MeshBasicMaterial( { map : texture } );
		var circle = new THREE.Mesh( geometry, material );
		return circle;
	},
	drawCandy3Random : function(){
		var geometry = new THREE.CircleGeometry( 80, 4 );
		var texture = new THREE.TextureLoader().load( "../../media/images/candy3.png" );
		var material = new THREE.MeshBasicMaterial( { map : texture } );
		var circle = new THREE.Mesh( geometry, material );
		return circle;
	},
	drawCandy4Random : function(){
		var geometry = new THREE.CircleGeometry( 60, 4 );
		var texture = new THREE.TextureLoader().load( "../../media/images/candy4.png" );
		var material = new THREE.MeshBasicMaterial( { map : texture } );
		var circle = new THREE.Mesh( geometry, material );
		return circle;
	},
	
	drawRectangleRandom : function(){
		if(apilib.convert(color) == 0xffffff){
			alert("here");
			renderer0.color = "#00ffff";
		}
		var rectLength = 400;
		var rectWidth = 300;
		var rectShape = new THREE.Shape();
		rectShape.moveTo( -30,-30 );
		rectShape.lineTo( 0, rectWidth -30);
		rectShape.lineTo( rectLength-30, rectWidth-30 );
		rectShape.lineTo( rectLength-30, -30 );
		rectShape.lineTo( -30, -30 );
		var rectGeom = new THREE.ShapeGeometry( rectShape );
		var rectMesh = new THREE.Mesh( rectGeom, new THREE.MeshBasicMaterial( { color: color } ) ) ;
		return [rectMesh];
	},

	drawCylinderRandom : function(){
		if(apilib.convert(color) == 0xffffff)
			renderer0.color = "#00ffff";		
		var geometry = new THREE.CylinderGeometry( 200, 200, 400, 100 );
		var material = new THREE.MeshBasicMaterial( { color: color } );
		var mesh	= new THREE.Mesh( geometry, material );
		return [mesh];
	},

	drawLine : function(){
		if(apilib.convert(color) == 0xffffff)
			renderer0.setClearColor( 0x00ffff );
		var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
		var dir = new THREE.Vector3( 1, 0, 0 );
		var origin = new THREE.Vector3( 0, 0, 0 );
		var length = 600;
		var hex = color;
		var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
		var dir = new THREE.Vector3( -1, 0, 0 );
		var origin = new THREE.Vector3( 0, 0, 0 );
		var length = 600;
		var hex = color;
		var ArrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
		return [arrowHelper,ArrowHelper];
	},

	drawSegment : function(){
		if(apilib.convert(color) == 0xffffff)
			renderer0.setClearColor( 0x00ffff );
		var material = new THREE.LineBasicMaterial({color: color});
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(-600, 0, 0));
    	geometry.vertices.push(new THREE.Vector3(600, 0, 0));
		var segment = new THREE.Line( geometry, material );
		return [segment];
	},

	drawPolygon : function(params){
		if(apilib.convert(color) == 0xffffff)
			renderer0.setClearColor( 0x00ffff );
		var sides = params[0];
		alert(sides)

		var geometry = new THREE.CircleGeometry( 300, sides );
		var material = new THREE.MeshBasicMaterial( { color: color } );
		var circle = new THREE.Mesh( geometry, material );
		if(sides == 4)
			circle.rotation.z = Math.PI / 4;
		return [circle];
	},

	drawBoxRandom : function(params){
		var geometry = new THREE.CubeGeometry( 400, 400, 400 );
		var material1 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "../../media/images/candy1.png" ) } );
	    var material2 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "../../media/images/candy1.png" )} );
	    var material3 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "../../media/images/candy1.png" )} );
	    var material4 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "../../media/images/candy1.png" )} );
	    var material5 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "../../media/images/candy1.png" )} );
	    var material6 = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "../../media/images/candy1.png" )} );
	    var materials = [material1, material2, material3, material4, material5, material6];
	    var meshFaceMaterial = new THREE.MeshFaceMaterial( materials );
		var mesh	= new THREE.Mesh( geometry, meshFaceMaterial );
	    return mesh;
	},

	randcolor : function(params)
	{
		var shapeIndex = apilib.randInt([2,12]);
		var colorIndex = apilib.randInt(params);
		color = colorArray[colorIndex];
		return shapeIndex;
	},
	randshape : function(params)
	{
		var shapeIndex = apilib.randInt(params);
		var colorIndex = apilib.randInt([1,16]);
		color = colorArray[colorIndex];
		return shapeIndex;
	},
	shapeToName : function(shape)
	{
		return shapeNameArray[shape];
	},
	shapeToVertex : function(shape)
	{
		switch(shape)
		{
			case 1:
				return 8;
			case 2:
				return 4;
			case 3:
				return 4;
			case 4:
				return 3;
			case 5:
				return 5;
			case 6:
				return 6;
			case 7:
				return 10;
			case 8:
				return 8;
		}
	},

	shapeToEdge : function(shape)
	{
		switch(shape)
		{
			case 1:
				return 12;
			case 2:
				return 4;
			case 3:
				return 4;
			case 4:
				return 3;
			case 5:
				return 5;
			case 6:
				return 6;
			case 7:
				return 10;
			case 8:
				return 8;
		}
	},

	convert : function(col)
	{
		if(col.length == 0)
			return;
		colHex = col.toString(16);
		length = colHex.length;
		for(var i = length; i < 6; i++)
		{
			colHex = "0" + colHex;
		}
		colHex = "0x" + colHex;
		return colHex;
	},

	colorToName : function(col)
	{
		for(var i = 0; i < colorArray.length; i++)
		{
			
			colHex = apilib.convert(colorArray[i]);
			if(col == colHex){
				alert("colHex"+colHex);
				alert("i" + i);
				return colorNameArray[i];
			}
		}
	},
	vertex_edgecount : function(params)
	{
		var i=0;
		var arr1 =[0xff0000,0x0000ff,0x0000a0,0x000000,0xffff00,0x008000,0x808080,0x00ff00,0x0080000,0x800080];
		var min=params[0];
		var max=params[1];
		var z=params[2];
		max=5;
		min=1;
		var zz=Math.floor(Math.random() * ( max - min + 1 )) + min;
		//var zz=Math.floor(Math.random() * ( max - min + 1 )) + min;
		var mesh;
		
		switch(zz)
		{
			case 1:
				mesh = apilib.drawRectangleRandom(arr1[zz]);
				break;
			case 2:
				mesh= apilib.drawBoxRandom([200,200,200],arr1[zz]);
				break;
			case 3:
				mesh= apilib.drawTriangleRandom([400],arr1[zz]);
				break;
			case 4:
				mesh= apilib.drawSquareRandom([500],arr1[zz]);
				break;
		    case 5:
				mesh= apilib.drawTriangleRandom([400],arr1[zz]);
				break;
		}
		window["scene"+i] = new THREE.Scene();
		window["scene"+i].add(mesh);
        window["renderer"+i].setClearColor(0xccffff);
		function render()
		{
			requestAnimationFrame(render);
			if(zz==2)
			{
				//mesh.rotation.z += .02;
                mesh.rotation.y+=0.05;
                //mesh.rotation.x+=0.1;
			}
            //mesh.rotation.z += .02;
            //mesh.rotation.y+=0.01;
           // mesh.rotation.x+=0.1;
			window["renderer"+i].render(window["scene"+i],window["camera"+i]);
		}

			render();

        switch(zz)
		{
			case 1:
				if(z==0)
					return "4";
				else
					return "4";
				 
			case 2:
				if(z==0)
					return "12";
				else
					return "8";
			case 3:
				if(z==0)
					return "3";
				else
					return "3";
			case 4:
				if(z==0)
					return "4";
				else
					return "4";
			case 5:
				if(z==0)
					return "3";
				else
					return "3";
		}
		
	},
//Form Functions
	createRadioDyn : function(count,level,functionName,params,correctAns,array,liID,temp){
		var optArray = [];
		optArray.push(correctAns);
		var para = new Array();
		for(var i = 1;i<count;i++)
		{
			var opt = apilib.evalFunc(functionName,params);
			if(Array.isArray(opt))
			{
					optArray.push(opt);
			}
			else
			{
				var flag = 0;
				for(var j = 0; j <optArray.length;j++)
				{
					if(opt == optArray[j])
					{
						flag = 1;
						i--;
						break;
					}		
				}
				if(flag === 0)
					optArray.push(opt);
		    }
		}
		var li = document.getElementById(liID);
		var options = apilib.shuffle(optArray);
		for(var i = 0;i<count;i++)
		{
			var p = document.createElement("p");
			var radio = document.createElement("input");
			radio.name = liID;
			radio.type = "radio";
			radio.id = liID+"radio"+i;
			radio.value = options[i];
			var label = document.createElement("label");
			label.htmlFor = liID+"radio"+i;
			label.appendChild(document.createTextNode(options[i]));
			p.appendChild(radio);
			p.appendChild(label);
			document.getElementById(liID).appendChild(p);
		}
	},
	createRadioStc : function(count,labelArr,liID){
		var li = document.getElementById(liID);
		for(var i = 0;i<count;i++)
		{
			var p = document.createElement("p");
			var radio = document.createElement("input");
			radio.name = liID;
			radio.type = "radio";
			radio.id = liID+"radio"+i;
			radio.value = labelArr[i].key;
			var label = document.createElement("label");
			label.htmlFor = liID+"radio"+i;
			var text = document.createTextNode(labelArr[i].key);
			label.style.fontWeight = "600";
			label.style.color = "#6e6e6e";
			label.appendChild(text);
			p.appendChild(radio);
			p.appendChild(label);
			document.getElementById(liID).appendChild(p);
		}

	},
	createLabel : function(count,functionName, params,liID){
		var li = document.getElementById(liID);
		var opt = apilib.evalFunc(functionName,params);
		for(var i = 0;i<count;i++)
		{
			var text = document.createElement("input");
			text.name = liID;
			text.type = "text";
			text.id = liID+"text"+i;
			text.value = opt;
			li.style.fontWeight = "600";
			text.fontSize = "100px";
			li.style.color = "#6e6e6e";
			document.getElementById(liID).appendChild(text);
		}		
	},

	createLabel : function(count,functionName, params,liID){
		var li = document.getElementById(liID);
		var opt = apilib.evalFunc(functionName,params);
		for(var i = 0;i<count;i++)
		{
			var text = document.createElement("input");
			text.name = liID;
			text.type = "text";
			text.id = liID+"text"+i;
			text.value = opt;
			li.style.fontWeight = "600";
			text.fontSize = "100px";
			li.style.color = "#6e6e6e";
			document.getElementById(liID).appendChild(text);
		}		
	},
	createTextBox : function(count,labelArr,liID){
			
	},
	executeForm : function(level,correctAnsArray,operation,attempt, subjectname, themename){
		array = [];
		array = apilib.calculate(correctAnsArray,operation);
		var form = JSON.parse(form_a);
		var funcCount = 0;
		var labelCount = 0;
		var typ = -1;
		for(var i = 0;i<form[level-1].questions.length;i++)
		{
			var li = document.createElement("li");
			li.id = "li"+i;
			li.class = "collection-item";
			var heading = document.createElement("H6");
			heading.class = "center-align";
			heading.appendChild(document.createTextNode(form[level-1].questions[i].key))
			li.appendChild(heading);
			document.getElementById("formUl").appendChild(li);
			typ = form[level-1].types[i].key;
			var count = form[level-1].types[i].count;
			if(typ == "radio")
			{
				if(form[level-1].dynamic[i].key)
				{
					exitFlag = apilib.createRadioDyn(count,level,form[level-1].functions[funcCount].functionName,
						form[level-1].functions[funcCount].params,array[i], array,li.id,form[level-1].questions.length);
					funcCount++;
				}
				else
					apilib.createRadioStc(count,form[level-1].labels[labelCount++].params,li.id);
			}
			if(typ == "text")
				apilib.createTextBox(count,form[level-1].labels[labelCount++].params,li.id);
			if(typ == "label"){
				apilib.createLabel(count,form[level-1].functions[funcCount].functionName,
							form[level-1].functions[funcCount].params,li.id);
				funcCount++;
			}
		}
		if(typ != "noSubmit"){
			li = document.createElement("li");
			li.id = "li"+form[level-1].questions.length;
			li.class = "collection-item center-align";
			var button = document.createElement("button");
			button.id = "button"+li.id;
		    button.type = "submit";
		    button.value = "Submit";
		    button.name = "Submit";
		    button.appendChild(document.createTextNode("Submit"));
		    li.appendChild(button);
		    document.getElementById("formUl").appendChild(li);
		   
		    button.onclick = function(){
		    	var form = JSON.parse(form_a);
				var funcCount = 0;
				var labelCount = 0;
				var ret = -1;
				// attempt++;
		    	var optArraySend = [];
		    	var userInputSend;
		    	var correctAnsSend;
		    	var levelSend = level;
		    	var solveTime = 0;
		    	if(typ == -1)
		    	{
		    		if(array.length != total.length)
		    			ret = -1;
		    		else{
		    			alert(total)
		    			alert(array)
		    			array.sort();
		    			total.sort();
		    			alert(total)
		    			alert(array)
			    		for(var i = 0; i < array.length; i++){
			    			if(array[i] == total[i]){
			    				ret = form[level-1].questions.length;
			    				if(operation == "mazeAdd"){
			    					circleCount = array[0];
			    					flagBoardAdd = 1;
			    				}
			    			}
			    			else{
			    				ret = -1;
			    				break;
			    			}
			    		}
			    	}
		    	}
		    	else if(typ == "radio")
		    	{
		    		ret = 0;
			    	for(var m = 0; m < form[level-1].questions.length; m++)
			    	{
			    		var count_check = form[level-1].types[m].count;
			    		for(var i = 0; i <count_check;i++)
			    			optArraySend.push(document.getElementById("li"+m+"radio"+i).value);
			    		for(var i = 0; i < count_check; i++)
			    		{
			    			if(document.getElementById("li"+m+"radio"+i).checked)
			    			{
			    				userInputSend = document.getElementById("li"+m+"radio"+i).value;
			    				correctAnsSend = array[m];
			    				if(document.getElementById("li"+m+"radio"+i).value == array[m])
				    			{
				    				ret++;
				    			}
				    		}
			    		}
			    		console.log("OptArray : "+optArraySend,"\nUserInput : "+userInputSend+"\nLevel : "+levelSend+"\nCorrectAnsSend : "+correctAnsSend+"\nAttempt : "+attempt);
			    	}
			    }
			    else if(typ == "label")
			    {
			    	ret = 0;
			    	for(var m = 0; m < form[level-1].questions.length; m++)
			    	{
			    		correctAnsSend = array;
			    		userInputSend = total;
			    		optArraySend = [];
			    		var count_check = form[level-1].types[m].count;
			    		for(var i = 0; i <count_check;i++)
			    			optArraySend.push(document.getElementById("li"+i+"text"+i).value);
			    		if(array.length != total.length)
		    			ret = -1;
			    		else{
			    			array.sort();
			    			total.sort();
				    		for(var i = 0; i < array.length; i++){
				    			if(array[i] == total[i]){
				    				ret = form[level-1].questions.length;
				    				if(operation == "mazeAdd")
				    					circleCount = array[0];
				    			}
				    			else{
				    				ret = -1;
				    				break;
				    			}
				    		}
				    	}
				    }
			    }
		    	if(ret == form[level-1].questions.length){
					assessmentCount_positive++;
					var str = "correct"
				}
				else{
					assessmentCount_negative++;
					var str = "wrong";
				}
		    	//apilib.run(str,form,attempt);
		    	
		for(var i = 0; i <= form[level-1].questions.length;i++)
		{
			var elem = document.getElementById("li"+i);
			elem.parentNode.removeChild(elem);
		}
		if(assessmentCount_positive === s[level-1].assessmentCount)
		{
			var str = "clu";
			var div = document.getElementById("levelCount");
			var img = document.createElement("img");
			img.src = "../../media/images/levelUp.png";
			img.class = "responsive-img";
			div.appendChild(img);
			level++;
			score++;
			assessmentCount_positive = 0;
			assessmentCount_negative = 0;
		}
		objects = [];
		document.getElementById("rendererDiv0").removeEventListener( 'mousedown', onDocumentMouseDown_NumLine, false );	
		document.getElementById("rendererDiv0").removeEventListener('mousedown', onDocumentMouseDown_mineSweeper, false );
		document.getElementById("rendererDiv0").removeEventListener('mousedown', onDocumentMouseDown_BoardGame, false );
		document.getElementById("rendererDiv0").removeEventListener('mousedown', onDocumentMouseDown_BoardGameCircle, false );
		for(var i = 0; i< s[s.length-1].rendererCount;i++)
		{
			//window["scene"+i].clear();
			window["scene"+i] = new THREE.Scene();
			window["renderer"+i].render(window["scene"+i],window["camera"+i]);
		}
		for(var i = 0; i< s[s.length-1].rendererCount;i++)
		{
			apilib.drawText([str,0,"sceneK",100]);
		}
		setTimeout(function(){
			for(var i = 0; i< s[s.length-1].rendererCount;i++)
			{
				window["scene"+i] = new THREE.Scene();
				window["renderer"+i].render(window["scene"+i],window["camera"+i]);
			}	
		
			apilib.execute(level,s,t,attempt,subjectname, themename);
			return false;
		},2000);

		    	console.log('bhej satrt');
    	
    		apilib.send(subjectname, themename, solveTime, level, subjectname, userInputSend, correctAnsSend, JSON.stringify(optArraySend), attempt);	

    		console.log('bhej diyra');
		    }


		    
		}
	},

	run : function(str,form,attempt, subjectname, themename){
		
		
	},
//Execute Function
	execute : function(level,s,t,attempt, subjectname, themename){
		correctAnsArray = [];
		if(level == s.length - 1)
			 return true;
		for(var k = 0; k< s[s.length-2].executeCount; k++)
		{
			for(var i = 0; i < s[level-1].functions.length; i++) //Execute all subject functions
				window[s[level-1].functions[i].returnValue] = apilib.evalFunc(s[level-1].functions[i].functionName,s[level-1].functions[i].params);
			for(var i = 0; i < t[0].functions.length; i++) //Execute all theme functions
				window[t[0].functions[i].returnValue] = apilib.evalFunc(t[0].functions[i].functionName,t[0].functions[i].params);
			correctAnsArray.push(correctAns);
		}
		if(s[s.length-1].rendererCount > s[s.length-2].executeCount)
		{
			var diffCount = s[s.length-1].rendererCount - s[s.length-2].executeCount;
			for(var i = 0; i < diffCount; i++)
			{
				for(var i = 0; i < s[level-1].functionsExtra.length; i++) //Execute all subject functions
					window[s[level-1].functionsExtra[i].returnValue] = apilib.evalFunc(s[level-1].functionsExtra[i].functionName,
							s[level-1].functionsExtra[i].params);
				for(var i = 0; i < t[0].functions.length; i++) //Execute all theme functions
					window[t[0].functions[i].returnValue] = apilib.evalFunc(t[0].functions[i].functionName,t[0].functions[i].params);
			}
		}
		return apilib.executeForm(level,correctAnsArray,operation,attempt, subjectname, themename);
	}
}