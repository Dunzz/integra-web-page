"""
Integra – Convertidor de Gaussian Splat (.ply) a formato web (.splat)
-------------------------------------------------------------------
Convierte el .ply que sale de nerfstudio / Postshot / Polycam, etc.
al formato compacto .splat (32 bytes por punto) que usa el visor 3D.

Uso (normalmente no hace falta: usa convertir-splat.bat):
    python ply2splat.py ARCHIVO.ply [SALIDA.splat]

Qué hace:
  - Quita puntos casi invisibles (opacidad < 2 %).
  - Si hay más de 1.5 millones, conserva los 1.5 millones más importantes
    (para que el archivo no pase de ~48 MB y cargue bien en celular).
  - Guarda el resultado en la carpeta models/ de la página.
  - Muestra el texto que hay que pegar en js/data.js.
"""
import os
import sys

try:
    import numpy as np
except ImportError:
    print("\n  Falta la librería 'numpy'. Instálala una sola vez con:")
    print("      python -m pip install numpy\n")
    sys.exit(1)

OPACIDAD_MIN = 0.02
MAX_PUNTOS = 1_500_000
SH_C0 = 0.28209479177387814


def leer_ply(ruta):
    with open(ruta, "rb") as f:
        props, n, formato = [], 0, ""
        primera = f.readline().strip()
        if primera != b"ply":
            raise ValueError("El archivo no es un .ply válido.")
        while True:
            linea = f.readline()
            if not linea:
                raise ValueError("Encabezado .ply incompleto.")
            linea = linea.decode("ascii", "replace").strip()
            if linea.startswith("format"):
                formato = linea.split()[1]
            elif linea.startswith("element vertex"):
                n = int(linea.split()[-1])
            elif linea.startswith("element") and n:
                break  # otros elementos después de vertex: no se usan
            elif linea.startswith("property") and not linea.startswith("property list"):
                _, tipo, nombre = linea.split()
                props.append((nombre, tipo))
            elif linea == "end_header":
                break
        if formato != "binary_little_endian":
            raise ValueError(f"Formato .ply no soportado: {formato} (se necesita binary_little_endian).")
        tipos = {"float": "<f4", "float32": "<f4", "double": "<f8", "uchar": "u1", "uint8": "u1",
                 "int": "<i4", "int32": "<i4", "uint": "<u4", "short": "<i2", "ushort": "<u2"}
        dt = np.dtype([(nom, tipos[t]) for nom, t in props])
        return np.fromfile(f, dtype=dt, count=n)


def convertir(origen, destino):
    print(f"\n  Leyendo {os.path.basename(origen)} ...")
    d = leer_ply(origen)
    requeridos = ["x", "y", "z", "f_dc_0", "f_dc_1", "f_dc_2", "opacity",
                  "scale_0", "scale_1", "scale_2", "rot_0", "rot_1", "rot_2", "rot_3"]
    faltan = [c for c in requeridos if c not in d.dtype.names]
    if faltan:
        raise ValueError("Este .ply no parece un Gaussian Splat (faltan: " + ", ".join(faltan) + ").\n"
                         "  Asegúrate de exportar el 'splat' y no la nube de puntos.")
    total = len(d)

    opacidad = 1 / (1 + np.exp(-d["opacity"].astype(np.float32)))
    escala = np.exp(np.stack([d["scale_0"], d["scale_1"], d["scale_2"]], 1).astype(np.float32))
    pos = np.stack([d["x"], d["y"], d["z"]], 1).astype(np.float32)
    ok = (opacidad >= OPACIDAD_MIN) & np.isfinite(pos).all(1) & np.isfinite(escala).all(1)
    d, opacidad, escala, pos = d[ok], opacidad[ok], escala[ok], pos[ok]

    orden = np.argsort(-(escala.prod(1) * opacidad))[:MAX_PUNTOS]
    d, opacidad, escala, pos = d[orden], opacidad[orden], escala[orden], pos[orden]

    rgb = np.stack([d["f_dc_0"], d["f_dc_1"], d["f_dc_2"]], 1) * SH_C0 + 0.5
    rgba = (np.clip(np.concatenate([rgb, opacidad[:, None]], 1), 0, 1) * 255).round().astype(np.uint8)
    rot = np.stack([d["rot_0"], d["rot_1"], d["rot_2"], d["rot_3"]], 1).astype(np.float32)
    rot /= np.maximum(np.linalg.norm(rot, axis=1, keepdims=True), 1e-8)
    rot = np.clip(rot * 128 + 128, 0, 255).round().astype(np.uint8)

    salida = np.zeros(len(d), dtype=np.dtype([("p", "<f4", 3), ("s", "<f4", 3), ("c", "u1", 4), ("r", "u1", 4)]))
    salida["p"], salida["s"], salida["c"], salida["r"] = pos, escala, rgba, rot
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    salida.tofile(destino)

    mb_in = os.path.getsize(origen) / 1e6
    mb_out = salida.nbytes / 1e6
    print(f"  Listo: {total:,} -> {len(d):,} puntos   |   {mb_in:.0f} MB -> {mb_out:.1f} MB")
    print(f"  Guardado en: {destino}")
    if mb_out > 95:
        print("\n  ATENCIÓN: pesa más de 95 MB; GitHub no acepta archivos de más de 100 MB.")

    # Sugerencia para js/data.js (escaneos de nerfstudio: Z hacia arriba -> rotación -90° en X)
    c = np.median(pos, 0)
    objetivo = [round(float(c[0]), 2), round(float(c[2]), 2), round(float(-c[1]), 2)]
    rango = np.percentile(pos, 95, 0) - np.percentile(pos, 5, 0)
    dist = round(float(max(rango) * 1.1), 2)
    camara = [objetivo[0], round(objetivo[1] + 0.3, 2), round(objetivo[2] + dist, 2)]
    try:
        rel = os.path.relpath(destino, os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/")
    except ValueError:  # otra unidad de disco
        rel = "models/" + os.path.basename(destino)
    print("\n  Para mostrarlo en la página, agrega esto al trabajo en js/data.js")
    print("  (la vista inicial es aproximada; pídele a Claude que la ajuste):\n")
    print(f'      modelo3d: "{rel}",')
    print(f"      vista3d: {{ objetivo: {objetivo}, camara: {camara}, rotacion: [-90, 0, 0] }},\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    origen = sys.argv[1]
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if len(sys.argv) > 2:
        destino = sys.argv[2]
    else:
        nombre = os.path.splitext(os.path.basename(origen))[0]
        if nombre.lower() in ("splat", "point_cloud", "output", "scene"):
            # nombre genérico: usar la carpeta para no sobrescribir otros modelos
            nombre = "modelo"
        destino = os.path.join(raiz, "models", nombre + ".splat")
        i = 2
        base = destino[:-6]
        while os.path.exists(destino):
            destino = f"{base}-{i}.splat"
            i += 1
    try:
        convertir(origen, destino)
    except Exception as e:
        print(f"\n  ERROR: {e}\n")
        sys.exit(1)
