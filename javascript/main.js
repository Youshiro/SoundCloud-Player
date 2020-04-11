//Creo objeto.
var soundCloudAPI = {}; 

/*-----FUNCIONES----*/

//Añado una funcion init al objeto.
soundCloudAPI.init = function(){
	
	SC.initialize({
		client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
	});	
}

//Añado funcion para obtener la pista al objeto.
soundCloudAPI.obtenerPista = function(nombre){
	
	//Obtengo la pista
	SC.get('/tracks',{ 
		q:nombre //Nombre que estoy buscando.
		
	}).then(function(pistas){
		
		soundCloudAPI.mostrarTarjetas(pistas);
	});		
}

//Crear tarjetas dinamicas y mostrarlas
soundCloudAPI.mostrarTarjetas = function(pistas){
	
	//BUCLE PARA RECORRER
	pistas
		.forEach(function(x){
				
			//TARJETA
			var tarjeta = document.createElement('div'); //Creo una etiqueta div.
			tarjeta.classList.add("card");//Añado la clase card a ese div.

			//IMAGEN
			var imagenDiv = document.createElement('div');
			imagenDiv.classList.add('image');

			var imagenImg = document.createElement('img');
			imagenImg.classList.add('image_img');
			imagenImg.src = x.artwork_url || 'https://cdn.2020prosoftware.com/installations/common/img/image-not-found.png'; //Algunas rutas de las img vienen en null y en ese caso, se mostrara la imagen de dicha URL.

			imagenDiv.appendChild(imagenImg);

			//CONTENIDO
			var contenido = document.createElement('div');
			contenido.classList.add('content');

			var cabecera = document.createElement('div');
			cabecera.classList.add('header');
			cabecera.innerHTML = '<a href="' + x.permalink_url +'"target="_blank">' + x.title + '</a>'; //Obtenemos el titulo del JSON.

			//BOTON
			var boton = document.createElement('div');
			boton.classList.add('ui','bottom','attached','button','js-button');

			var icono = document.createElement('i');
			icono.classList.add('add','icon');

			var textoBoton = document.createElement('span');
			textoBoton.innerHTML = 'Agregar a la lista de reproducción';


			//AGREGO AL CONTENIDO
			contenido.appendChild(cabecera);
		
			boton.appendChild(icono);
			boton.appendChild(textoBoton);
			boton.addEventListener('click',function(){
				soundCloudAPI.getEmbed(x.permalink_url);
			});

			tarjeta.appendChild(imagenDiv);
			tarjeta.appendChild(contenido);
			tarjeta.appendChild(boton);

			var buscarResultados = document.querySelector('.buscar-resultados-js');
			buscarResultados.appendChild(tarjeta);				 
		});
}

//AGREGAR PLAYLIST Y ESCUCHAR MUSICA:
soundCloudAPI
	.getEmbed = function(url){	
		SC.oEmbed(url, {
		  auto_play: true
		}).then(function(embed){
			var sideBar = document.querySelector('.js-playlist');
			
			var caja = document.createElement('div');
			caja.innerHTML = embed.html;
			
			sideBar.insertBefore(caja,sideBar.firstChild);
			sessionStorage.setItem("key",sideBar.innerHTML); //Guardamos en memoria local.
		});	
}

soundCloudAPI
	.buscar = function buscar(){
		var botonBuscar = document.querySelector('.js-submit');
		botonBuscar.addEventListener('click',function(){
			var nombre = document.querySelector('input').value;
			soundCloudAPI.obtenerPista(nombre);
			
			//LIMPIEZA
			var contenido = document.querySelector('.buscar-resultados-js');
			contenido.innerHTML = "";
		});
}

//Obtenemos la  memoria local, para cuando actualize no se pierda la playlist, y la mostramos.
var sideBar = document.querySelector(".js-playlist");
sideBar.innerHTML = sessionStorage.getItem("key");


//LLAMADA DE FUNCIONES.
soundCloudAPI.init();
soundCloudAPI.buscar();



