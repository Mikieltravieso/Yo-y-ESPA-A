window.onload = function(){
	//Boton información
	document.getElementById("infobot").onclick = function (){
		document.getElementById("informacion").style.display="inline-block";
		document.getElementById("infobot").style.backgroundColor="#525151";
		document.getElementById("examen").style.display=" none";
		document.getElementById("examenbot").style.backgroundColor=" rgba(0,0,0,0)";
		document.getElementById("about").style.display=" none";
		document.getElementById("aboutbot").style.backgroundColor=" rgba(0,0,0,0)";
		
	}
	//Boton examen
	document.getElementById("examenbot").onclick = function (){
		document.getElementById("informacion").style.display="none";
		document.getElementById("infobot").style.backgroundColor=" rgba(0,0,0,0)";
		document.getElementById("examen").style.display="inline-block";
		document.getElementById("examenbot").style.backgroundColor="#525151";
		document.getElementById("about").style.display="none";
		document.getElementById("aboutbot").style.backgroundColor=" rgba(0,0,0,0)";
	}
	//Boton about
	document.getElementById("aboutbot").onclick = function (){
		document.getElementById("informacion").style.display="none";
		document.getElementById("infobot").style.backgroundColor=" rgba(0,0,0,0)";
		document.getElementById("examen").style.display="none";
		document.getElementById("examenbot").style.backgroundColor=" rgba(0,0,0,0)";
		document.getElementById("about").style.display="inline-block";
		document.getElementById("aboutbot").style.backgroundColor="#525151";
	}	
	
	
	
	
	
	
}