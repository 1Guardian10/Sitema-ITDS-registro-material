import { useEffect, useState } from "react"
import { Package, PlusCircle, Plus, BookOpen,RotateCcw } from "lucide-react"
import type { Material, Prestamos } from "../Colection"
import { getDocument} from "../DB/Crud"
import { useNavigate, Link } from "react-router-dom";

const ListaR = () => {
  const navigate = useNavigate()
  const [prestamos, setPrestamos] = useState<Prestamos[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);

  useEffect(() => {
    const fetchPrestamo = async () => {
      const listaPrestamos = await getDocument("Prestamos")
      console.log(listaPrestamos)
      //setPrestamos(listaPrestamos)
      filtrarPrestamos(listaPrestamos);
    }
    const fetchMaterial = async () => {
      const listaMateriales = await getDocument("Material") // Corrección aquí
      setMateriales(listaMateriales) // Ahora almacena los materiales correctamente
    }
    fetchPrestamo();
    fetchMaterial();
  }, [])

  const obtenerNombresMateriales = (items: { Cantidad: number; IdMaterial: string }[]) => {
    console.log(items)
    return items.map((item) => {
      const material = materiales.find((m) => m.id === item.IdMaterial);
      return material ? `${material.Nombre} (x${item.Cantidad})` : "Desconocido";
    }).join(", ");
  }

  const filtrarPrestamos=(pre:Prestamos[])=>{
    const p= pre.filter((p)=>p.Estado===false)
    setPrestamos(p)
  }

  return (
    <>
      <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg mb-8 border border-neutral-300 border-opacity-10">
        <div className="px-4 py-5 sm:px-6 bg-primary/5">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-dark flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Lista de prestamos devueltos
              </h2>
              <button className="sm:hidden inline-flex items-center justify-center p-1.5 rounded-full bg-black text-white">
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-end items-center w-full gap-4">
              <div className="flex items-center gap-2">
                <Link to="/reportes/agregarM">
                  <button className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/90 transition-colors">
                    <Plus className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Nuevo Material</span>
                    <span className="sm:hidden">Nuevo</span>
                  </button>
                </Link>
                <Link to="/reportes/agregarP">
                  <button className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/90 transition-colors">
                    <BookOpen className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Registrar Préstamo</span>
                    <span className="sm:hidden">Préstamo</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral/10">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                    Solicitante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                    Fecha Entrega
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                    Fecha Recepcion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                    Materiales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                    Observaciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                    Editar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                    Devolver
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral/10">
                {prestamos.length > 0 ? (
                  prestamos.map((p) => (
                    <tr key={p.id} className="hover:bg-background transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral">{p.Solicitante}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                        {p.FechaPrestamo.toDate().toISOString().split("T")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                        {p.FechaDevolucion
                          ? p.FechaDevolucion.toDate().toISOString().split("T")[0]
                          : "No hay fecha"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                        {obtenerNombresMateriales(p.Items)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                        {p.Observaciones === "" ? "Sin Observaciones" : p.Observaciones}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                        <button
                          onClick={() => {
                            navigate(`/reportes/agregarP/${p.id}`)
                          }}
                          className="items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/90 transition-colors"
                        >
                          Editar
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                        <p
                          className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-black hover:bg-primary-light transition-colors"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Devevuelto
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-neutral">
                      No hay devoluciones de material
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListaR;
