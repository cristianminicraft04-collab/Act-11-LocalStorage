class ResiduoRPBI {
    constructor(area, tipo, peso) {
        this.id = Date.now();
        this.area = area;
        this.tipo = tipo;
        this.peso = parseFloat(peso);
    }
}

const inputArea = document.getElementById('areaHosp');
const selectTipo = document.getElementById('tipoRPBI');
const inputPeso = document.getElementById('pesoKg');
const btnAgregar = document.getElementById('btnAgregarResiduo');
const listaResiduos = document.getElementById('listaResiduos');
const spanTotPunzo = document.getElementById('totPunzo');
const spanTotPato = document.getElementById('totPato');

const STORAGE_KEY = 'manifiesto_rpbi_registros';

let registrosRPBI = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function actualizarInterfaz() {
    listaResiduos.innerHTML = '';

    let totalPunzocortantes = 0;
    let totalPatologicos = 0;

    registrosRPBI.forEach((residuo) => {
        if (residuo.tipo === 'punzocortante') {
            totalPunzocortantes += residuo.peso;
        } else if (residuo.tipo === 'patologico') {
            totalPatologicos += residuo.peso;
        }

        const esPunzo = residuo.tipo === 'punzocortante';
        const badgeColor = esPunzo ? 'bg-danger' : 'bg-warning text-dark';
        const etiquetaTipo = esPunzo ? 'Punzocortante' : 'Patológico';

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        li.innerHTML = `
            <div>
                <span class="badge ${badgeColor} me-2">${etiquetaTipo}</span>
                <strong class="text-dark">${residuo.area}</strong>
            </div>
            <div>
                <span class="fw-bold text-secondary me-3">${residuo.peso.toFixed(2)} kg</span>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarResiduo(${residuo.id})">Eliminar</button>
            </div>
        `;

        listaResiduos.appendChild(li);
    });

    spanTotPunzo.textContent = totalPunzocortantes.toFixed(2);
    spanTotPato.textContent = totalPatologicos.toFixed(2);
}

function guardarEnStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrosRPBI));
}

btnAgregar.addEventListener('click', () => {
    const area = inputArea.value.trim();
    const tipo = selectTipo.value;
    const peso = parseFloat(inputPeso.value);

    if (area === '' || isNaN(peso) || peso <= 0) {
        alert('Por favor, ingresa un área válida y un peso mayor a 0 kg.');
        return;
    }

    const nuevoResiduo = new ResiduoRPBI(area, tipo, peso);

    registrosRPBI.push(nuevoResiduo);
    guardarEnStorage();
    actualizarInterfaz();

    inputArea.value = '';
    inputPeso.value = '';
    inputArea.focus();
});

window.eliminarResiduo = function(id) {
    registrosRPBI = registrosRPBI.filter(item => item.id !== id);
    guardarEnStorage();
    actualizarInterfaz();
};

document.addEventListener('DOMContentLoaded', actualizarInterfaz);