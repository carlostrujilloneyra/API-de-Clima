const container = document.getElementById('container');
const resultado = document.getElementById('resultado');
const formulario = document.getElementById('formulario');

window.addEventListener('load', ()=>{
	formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e){
	e.preventDefault();

	// Validar
	const ciudad = document.getElementById('ciudad').value;
	const pais = document.getElementById('pais').value;

	if(ciudad ==='' || pais ===''){
		mostrarError('¡Debes completar ambos campos!');
		return;
	}

	// Consultar la API
	consultarAPI(ciudad, pais);
}

// Función Mostrar error

function mostrarError(mensaje){

	const alerta = document.querySelector('.error');

	if(!alerta){
		const alerta = document.createElement('p');
		alerta.classList.add('error');
		alerta.innerText= mensaje;
		container.appendChild(alerta);
	
		setTimeout(() => {
			alerta.remove();
		}, 4000);
	}
}

// Función de Consultar API

function consultarAPI(ciudad, pais){

	const appId = 'a599c68599dac47b183377f6e8e9946b';
	
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

	// Antes que mande a consultar
	Spinner();

	fetch(url)
	.then(respuesta => {
		return respuesta.json();
	})
	.then(datos => {

		LimpiarHTML();

		if(datos.cod === "404"){
			mostrarError('¡Error! Ciudad no encontrada');
			return;
		}

		// Imprime la respuesta en el HTML
		mostrarClima(datos);
	})

}

function mostrarClima(datos){
	const {name, main: {temp, temp_max, temp_min}} = datos;

	const centigrados = kelvinACentrigados(temp);
	const max = kelvinACentrigados(temp_max);
	const min = kelvinACentrigados(temp_min);
	
	const nombreCiudad = document.createElement('p');
	nombreCiudad.textContent= `Clima en ${name}`;
	nombreCiudad.classList.add('ciudad');

	// Temperatura actual
	const actual = document.createElement('p');
	actual.innerHTML = `${centigrados} &#8451;`;
	actual.classList.add('centigrados');

	// Temperatura maxima
	const tempMax = document.createElement('p');
	tempMax.innerHTML = `Máx: ${max} &#8451;`;
	tempMax.classList.add('centigrados-max');

	// Temperatura mínia
	const tempMin = document.createElement('p');
	tempMin.innerHTML = `Mín: ${min} &#8451;`;
	tempMin.classList.add('centigrados-min');

	const resultadoDiv = document.createElement('div');
	resultadoDiv.classList.add('container-resutado');
	resultadoDiv.appendChild(nombreCiudad);
	resultadoDiv.appendChild(actual);
	resultadoDiv.appendChild(tempMax);
	resultadoDiv.appendChild(tempMin);
	resultado.appendChild(resultadoDiv);
}

const kelvinACentrigados = grados => parseInt(grados - 273.15);

// Casi siempre usa esta función de abajo

function LimpiarHTML(){
	while(resultado.firstChild){
		resultado.removeChild(resultado.firstChild);
	}
}

function Spinner(){

	LimpiarHTML();

	const divSpinner = document.createElement('div');
	divSpinner.classList.add('sk-chase');

	divSpinner.innerHTML = `
	<div class="sk-chase-dot"></div>
  	<div class="sk-chase-dot"></div>
  	<div class="sk-chase-dot"></div>
  	<div class="sk-chase-dot"></div>
  	<div class="sk-chase-dot"></div>
 	 <div class="sk-chase-dot"></div>
	`;
	
	resultado.appendChild(divSpinner);
}