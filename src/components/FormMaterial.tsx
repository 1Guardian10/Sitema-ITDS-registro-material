import { useState , useEffect} from "react"
import type { Material } from "../Colection"
import { Package, Save } from "lucide-react"
import { insertDocument,updateDocument,getDocumentById } from "../DB/Crud"
import { useNavigate,useParams } from "react-router-dom"

type MaterialSinID = Omit<Material, "id">;
interface FormMaterialProps {
  page: string;
};

type ID = Omit<Material, "Nombre"|"Disponibles"|"Descripcion"|"Estado"|"Total">

const FormMaterial:React.FC<FormMaterialProps> = ({ page }) => {
  const { idParametro } = useParams<{ idParametro?: string }>(); // idParametro puede ser undefined
  const [error,setError] = useState<string>("");
  const [Id, setId] = useState<ID | null>(
    idParametro ? { id: idParametro } : null
  );
  console.log(page);
  
  const [material, setMaterial] = useState<MaterialSinID>({
    Nombre: "",
    Disponibles: 0,
    Descripcion: "",
    Estado: true,
    Total: 0,
  })

  const navigate = useNavigate();

  useEffect(() => {
    if (!Id || !Id.id) return; // Si Id es null o Id.id es undefined, salimos
  
    const fetchMaterial = async () => {
      const listaMaterial = await getDocumentById("Material", Id.id);
      console.log(listaMaterial)
      if (listaMaterial) {
        setMaterial(listaMaterial);
      }
    };
  
    fetchMaterial();
  }, [Id]); // Se ejecuta solo cuando Id cambia
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validación inmediata antes de intentar insertar
    if (material.Disponibles > material.Total) {
      setError("La cantidad disponible no puede ser mayor a la cantidad total");
      return; // Evita que se ejecute el código de inserción
    } else {
      setError("");
    }
  
    if (Id === null) {
      insertDocument("Material", material);
    } else {
      updateDocument("Material",Id.id,material);
    }
  
    setMaterial({
      Nombre: "",
      Disponibles: 0,
      Descripcion: "",
      Estado: true,
      Total: 0,
    });
  
    navigate(`/${page}`);
  };
  

  const handleCancel = () => {
    navigate(`/${page}`);
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-1/2 bg-white shadow-lg overflow-hidden sm:rounded-lg mb-8 border border-neutral-300 border-opacity-10">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 bg-primary/5">
          <h2 className="text-lg leading-6 font-medium text-dark flex items-center">
            <Package className="h-5 w-5 mr-2" />
            {Id ? "Editar Material" : " Agregar Material"}
          </h2>
        </div>

        {/* Form */}
        <div className="px-6 py-5 border-t border-neutral/10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
                <input
                  type="text"
                  value={material.Nombre}
                  required
                  placeholder="Ingrese el nombre del material"
                  className="block w-full rounded-md border border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                  onChange={(e) => setMaterial({ ...material, Nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">Descripción</label>
                <textarea
                  value={material.Descripcion}
                  placeholder="Ingrese una descripción detallada"
                  rows={3}
                  className="block w-full rounded-md border border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                  onChange={(e) => setMaterial({ ...material, Descripcion: e.target.value })}
                />
              </div>

              {Id === null ? (
                <>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Cantidad Total</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={material.Total || ""}
                    placeholder="Ingrese la cantidad total"
                    className="block w-full rounded-md border border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                    onChange={(e) => {
                      const total = Number.parseInt(e.target.value) || 0;
                      setMaterial({ ...material, Total: total, Disponibles: total });
                    }}
                  />
                  <p className="mt-1 text-xs text-neutral">
                    Esta cantidad se establecerá como el total y disponibles inicialmente.
                  </p>
                </div>
                {error!=="" && <p className="text-red-500 text-xs">{error}</p>}
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Total</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={material.Total || ""}
                      placeholder="Ingrese la cantidad total"
                      className="block w-full rounded-md border border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                      onChange={(e) => {
                        const total = Number.parseInt(e.target.value) || 0;
                        setMaterial({ ...material, Total: total });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Disponibles</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={material.Disponibles || ""}
                      className="block w-full rounded-md border border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                      onChange={(e) => {
                        const dispo = Number.parseInt(e.target.value) || 0;
                        setMaterial({ ...material, Disponibles: dispo });
                      }}
                    />
                  </div>
                  {error!=="" && <p className="text-red-500 text-xs">{error}</p>}
                </>
              )}
            </div>
            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-3 pt-5 border-t border-neutral/10">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-neutral/20 rounded-md text-sm font-medium text-dark hover:bg-background transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-black/90 transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                Guardar Material
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormMaterial