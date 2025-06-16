function calcularRuta(coordenadas, usarManhattanFlag) {
    fetch('/calcular_ruta', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ubicaciones: coordenadas,
            usarManhattan: usarManhattanFlag
        })
    })
    .then(res => res.json())
    .then(data => {
        // Mostrar el mensaje en el div #mensaje

        // Limpiar rutas anteriores (asumiendo que agregas polylines)
        map.eachLayer(layer => {
            if (layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });

        if (usarManhattanFlag) {
            let rutaManhattan = ajustarRutaManhattan(data.ruta);
            // Convertir la ruta en un array [lat, lng] para Leaflet
            let rutaCoords = rutaManhattan.map(p => [p.lat, p.lng]);
            L.polyline(rutaCoords, { color: 'blue', weight: 5 }).addTo(map);
        } else {
            let rutaNormal = data.ruta.map(p => [p[0], p[1]]);
            L.polyline(rutaNormal, { color: 'red', weight: 5 }).addTo(map);
        }
    })
    .catch(error => {
        console.error('Error al calcular ruta:', error);
        document.getElementById('mensaje').innerText = "Error al calcular la ruta. Intente de nuevo.";
    });
}

// Función para ajustar la ruta Manhattan (tu código original)
function ajustarRutaManhattan(coordenadas) {
    let rutaManhattan = [];
    
    for (let i = 0; i < coordenadas.length - 1; i++) {
        let inicio = coordenadas[i];
        let destino = coordenadas[i + 1];

        let actual = { lat: inicio.lat, lng: inicio.lng };

        // Ajustar latitud con pasos pequeños para simular Manhattan vertical
        while (Math.abs(actual.lat - destino.lat) > 0.0001) {
            actual.lat += (actual.lat < destino.lat) ? 0.0005 : -0.0005;
            rutaManhattan.push({ lat: actual.lat, lng: actual.lng });
        }
        
        // Ajustar longitud con pasos pequeños para simular Manhattan horizontal
        while (Math.abs(actual.lng - destino.lng) > 0.0001) {
            actual.lng += (actual.lng < destino.lng) ? 0.0005 : -0.0005;
            rutaManhattan.push({ lat: actual.lat, lng: actual.lng });
        }
    }
    
    return rutaManhattan;
}
