var problem = [], number="",  opRegex = /[-+*\/]/;
var matchOp ={"×":"*","÷":"/","+":"+","-": "-"};
var answerHit = false;
var colors=["#6699ff","#009999","#ccff33","#ff3300","#660066","#0033cc"],color=0;
$( document ).ready(function() {
  $(".operator").on("click",function(){
    if(opRegex.test(problem[problem.length - 1]) || problem.length == 0)return;
    answerHit = false;
    number ="";
    problem.push(matchOp[$(this).html()]);
    $(".box").html($(this).html());
    displayEquation();
    console.log(problem);
  });
  
  $(".number").on("click",function(){
    if(!opRegex.test(problem[0]) && problem.length ==1 && answerHit == true){
     problem =[];
     answerHit = false; 
    }    
    if((problem[problem.length - 1] === "." && $(this).html() === ".") || problem.join("").length > 20)return;
    problem.push($(this).html());    
    number += $(this).html();
    $(".box").html(number);
    displayEquation();
    console.log(problem);
  });
  
  $(".equals").on("click",function(){
    if(opRegex.test(problem[problem.length-1]) || !opRegex.test(problem.join("")))return;
    $("body").css("background-color",colors[(++color)%5]);
    var equation = displayEquation();
    var answer = calculator(problem.join(""));
    problem =[];
    problem.push(answer < 0?"u" + (answer*(-1)).toString():answer.toString());
    $(".box2").html(equation + " = " + answer);    
    $(".box").html(answer);
    console.log(problem);
    number = "";
    answerHit = true;
  });
  
   $(".AC").on("click",function(){
    answerHit = false;
    problem = [];
    number = ""; 
    $(".box,.box2").html("0"); 
    console.log(problem);
  });
  
   $(".CE").on("click",function(){
     answerHit = false;
     if(opRegex.test(problem[problem.length-1])){
       problem.splice(problem.length-1,1);      
     } else {
       for(x = problem.length-1; !opRegex.test(problem[x-1])&& x-1>=0;x--){}
       problem.splice(x,problem.length - x);
     }
     $(".box").html("");
     $(".box2").html(displayEquation());
     console.log(problem);
  });
  
});

function displayEquation(){
    var string = problem.join("").replace(/[*]/g,"×").replace(/[\/]/,"÷").replace(/u/,"-");
    $(".box2").html(string);
    return string;
}

function Stack() {
 
   var items = [];
 
   this.push = function(element){
       items.push(element);
   };
 
   this.pop = function(){
       return items.pop();
   };
 
   this.peek = function(){
       return items[items.length-1];
   };
 
   this.isEmpty = function(){
       return items.length == 0;
   };
 
   this.size = function(){
       return items.length;
   };
 
   this.clear = function(){
       items = [];
   };
 
   this.print = function(){
       console.log(items.toString());
   };
}
function convert(x){
	if(/u/.test(x)){
     		x = x.substring(1,x.length); 
     		x = parseFloat(x);
        x *= (-1);
     }  else {
     		x = parseFloat(x);
     }
     
     return x;
}

 function calculate(a,b,op){
   a = convert(a);	
   b = convert(b);      
   switch(op){
    case "*":return (b*a);
    case "+":return (a+b);
    case "-":return (b-a);
    case "/":return (b/a);
    }
 }

function calculator(problem){
  var stack= new Stack();
  var p = "";//postfix
  var precedence = {"-":0,"+":0,"*":1,"/":1};
  var numRegex = /[0-9.u]/;

  for(var x = 0; x < problem.length;x++){
    if(numRegex.test(problem[x])){
      var num = problem[x];
      while(numRegex.test(problem[x+1]) && x+1 < problem.length){
        x++;
        num += problem[x];
      }
      p += num + " ";
    } else if(opRegex.test(problem[x])){
      if(stack.peek() == undefined){
        stack.push(problem[x]);
      } else {
        while(stack.peek() !== undefined && precedence[problem[x]] <= precedence[stack.peek()]){ 
          p += stack.pop() + " ";
        }
        stack.push(problem[x]);
      }
    }
  }
  stack.print();
  while(stack.peek() !== undefined){
    p += stack.pop() + (stack.peek()===undefined?"":" ");
  }

  p = p.split(" ");//make p an array
  for(x = 0;x<p.length;x++){
    if(numRegex.test(p[x])){
      stack.push(p[x]);
    } else {
      stack.push(calculate(stack.pop(),stack.pop(),p[x]));
    }
  }
  stack.print();
  
  if(/[.]/.test(stack.peek())){
    return  Number((stack.peek()).toFixed(5));
  }
  
  return (stack.peek());
}