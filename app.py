from flask import Flask, render_template, request, jsonify
import networkx as nx

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

def calcular_ruta_optima_dijkstra(ubicaciones):
    G = nx.Graph()
    for i, ubicacion in enumerate(ubicaciones):
        G.add_node(i, pos=ubicacion)

    for i in range(len(ubicaciones)):
        for j in range(i + 1, len(ubicaciones)):
            dx = abs(ubicaciones[i][0] - ubicaciones[j][0])
            dy = abs(ubicaciones[i][1] - ubicaciones[j][1])
            distancia_manhattan = dx + dy
            distancia_euclidiana = (dx**2 + dy**2)**0.5

            # Si la distancia Euclidiana es menor a 2km aprox (0.018 grados), usar Manhattan
            if distancia_euclidiana < 0.018:
                distancia = distancia_manhattan
            else:
                distancia = distancia_euclidiana

            G.add_edge(i, j, weight=distancia)

    ruta_optima = nx.dijkstra_path(G, source=0, target=len(ubicaciones) - 1, weight='weight')
    return [ubicaciones[n] for n in ruta_optima]

@app.route('/calcular_ruta', methods=['POST'])
def calcular_ruta():
    datos = request.get_json()
    ubicaciones = datos["ubicaciones"]

    ruta_optima = calcular_ruta_optima_dijkstra(ubicaciones)

    mensaje = "Se usa distancia Manhattan para trayectos cortos y Euclidiana (Dijkstra) para largos."

    return jsonify({"ruta": ruta_optima, "mensaje": mensaje})

if __name__ == '__main__':
    app.run(debug=True)
