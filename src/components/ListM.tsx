import { useEffect, useState } from "react"
import { Package, PlusCircle,Plus} from "lucide-react"
import type { Material } from "../Colection"
import { getDocument } from "../DB/Crud"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Lista = () => {
  const navigate = useNavigate()
  const [material, setMaterial] = useState<Material[]>([])

  useEffect(() => {
    const fetchMaterial = async () => {
      const listaMaterial = await getDocument("Material")
      setMaterial(listaMaterial)
    }

    fetchMaterial()
  }, [])
  console.log(material)
  return (
    <>
      {/* Lista de materiales */}
      <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg mb-8 border border-neutral-300 border-opacity-10">
        <div className="px-4 py-5 sm:px-6 bg-primary/5">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-dark flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Lista de Materiales
              </h2>

              <button className="sm:hidden inline-flex items-center justify-center p-1.5 rounded-full bg-black text-white">
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>

            {/* barra de bsqueda y para agregar nuevo material */}
            <div className="flex justify-end items-center w-full gap-4">
              <div className="flex items-center gap-2">
                <Link to="/materiales/agregarM">
                  <button className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/90 transition-colors">
                    <Plus className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Nuevo Material</span>
                    <span className="sm:hidden">Nuevo</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                    Disponibles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">Editar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral/10">
                {material.length > 0 ? (
                  material.map((m) => (
                    <tr key={m.id} className="hover:bg-background transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">{m.Nombre}</td>
                      <td className="px-6 py-4 text-sm text-neutral">{m.Descripcion===""?"No hay descripcion":m.Descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">{m.Total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">{m.Disponibles}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                        <button
                          onClick={() => {
                            navigate(`/materiales/agregar/${m.id}`)
                          }}
                          className="items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/90 transition-colors"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-neutral">
                      No hay materiales registrados
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

export default Lista;