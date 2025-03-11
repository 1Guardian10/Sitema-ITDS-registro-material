import { useState, useEffect } from "react";
import type { Prestamos, Material, LoanItem } from "../../Colection";
import { Package, Save, Plus, Trash2 } from "lucide-react";
import { insertDocument, updateDocument, getDocumentById, getDocument } from "../../DB/Crud";
import { useNavigate, useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";

type PrestamosSinID = Omit<Prestamos, "id">;
interface FormPrestamoProps {
  page: string;
}

type ID = Omit<Prestamos, "FechaDevolucion"|"FechaPrestamo"|"Estado"|"Items"|"Observaciones"|"Solicitante">;

const FormLoan: React.FC<FormPrestamoProps> = ({ page }) => {
  const [cantidadesOriginales, setCantidadesOriginales] = useState<{ [key: string]: number }>({});
  const { idParametro } = useParams<{ idParametro?: string }>();
  const [error, setError] = useState<string>("");
  const [material, setMaterial] = useState<Material[]>([]);
  const [Id, setId] = useState<ID | null>(
    idParametro ? { id: idParametro } : null
  );

  const [prestamo, setPrestamo] = useState<PrestamosSinID>({
    FechaPrestamo: Timestamp.now(),
    Estado: true,
    Items: [{ IdMaterial: "", Cantidad: 1 }],
    Observaciones: "",
    Solicitante: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!Id || !Id.id) return;
  
    const fetchPrestamo = async () => {
      try {
        const listaPrestamo = await getDocumentById("Prestamos", Id.id);
        if (listaPrestamo) {
          setPrestamo(listaPrestamo);
          const cantidadesIniciales: { [key: string]: number } = {};
          listaPrestamo.Items.forEach((item:LoanItem )=> {
            cantidadesIniciales[item.IdMaterial] = item.Cantidad;
          });

          setCantidadesOriginales(cantidadesIniciales);
        } else {
          setError("No se encontró el préstamo.");
        }
      } catch (error) {
        console.error("Error cargando el préstamo:", error);
        setError("Error al cargar el préstamo.");
      }
    };
  
    fetchPrestamo();
  }, [Id]);
  

  useEffect(() => {
    const fetchMaterial = async () => {
      const listaM = await getDocument("Material");
      if (listaM) {
        setMaterial(listaM);
      }
    };
    fetchMaterial();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de materiales antes de enviar
    for (const item of prestamo.Items) {
      const selectedMaterial = material.find((m) => m.id === item.IdMaterial);
  
      if (!selectedMaterial) {
        setError("Material no encontrado.");
        return;
      }
  
      if (item.Cantidad > selectedMaterial.Disponibles) {
        setError(`La cantidad de ${selectedMaterial.Nombre} no puede superar ${selectedMaterial.Disponibles}.`);
        return;
      }
    }
  
    setError(""); // Reiniciar errores si todo está bien
  
    try {
      if (Id === null) {
        // AGREGAR UN NUEVO PRÉSTAMO
        const newLoanRef = await insertDocument("Prestamos", prestamo);
        
        // Reducir disponibilidad de los materiales
        prestamo.Items.forEach(async (item) => {
          const selectedMaterial = material.find((m) => m.id === item.IdMaterial);
          if (selectedMaterial) {
            await updateDocument("Material", selectedMaterial.id, {
              Disponibles: selectedMaterial.Disponibles - item.Cantidad,
            });
          }
        });
  
        console.log("Préstamo agregado con éxito:", newLoanRef);
  
      } else {
        // EDITAR UN PRÉSTAMO EXISTENTE**
        await updateDocument("Prestamos", Id.id, prestamo);

        prestamo.Items.forEach(async (item) => {
          const selectedMaterial = material.find((m) => m.id === item.IdMaterial);
          if (selectedMaterial) {
            const cantidadAnterior = cantidadesOriginales[item.IdMaterial] || 0;
            const diferencia = item.Cantidad - cantidadAnterior;

            if (page!=="reportes" ){
            await updateDocument("Material", selectedMaterial.id, {
              Disponibles: selectedMaterial.Disponibles - diferencia,
            });
            }
          }
        });
  
        console.log("Préstamo actualizado con éxito:", Id.id);
      }
  
      // Reiniciar formulario
      setPrestamo({
        FechaPrestamo: Timestamp.now(),
        Estado: true,
        Items: [{ IdMaterial: "", Cantidad: 1 }],
        Observaciones: "",
        Solicitante: "",
      });
  
      // Redireccionar después de guardar
      navigate(`/${page}`);
    } catch (error) {
      console.error("Error al guardar:", error);
      setError("Hubo un problema al guardar el préstamo.");
    }
  };  

  const handleCancel = () => {
    navigate(`/${page}`);
  };

  const addItem = () => {
    setPrestamo({
      ...prestamo,
      Items: [...prestamo.Items, { IdMaterial: "", Cantidad: 1 }]
    });
  };

  const removeItem = async (index: number) => {
    const itemEliminado = prestamo.Items[index]; // Obtener el item que se va a eliminar
    const selectedMaterial = material.find(m => m.id === itemEliminado.IdMaterial);
  
    if (selectedMaterial) {
      const cantidadAnterior = cantidadesOriginales[itemEliminado.IdMaterial] || 0;

      if (page!=="reportes" ){
      // Devolver la cantidad eliminada al stock
      await updateDocument("Material", selectedMaterial.id, {
        Disponibles: selectedMaterial.Disponibles + cantidadAnterior
      });
    }
  
      // Eliminar del registro de cantidades originales
      const nuevasCantidadesOriginales = { ...cantidadesOriginales };
      delete nuevasCantidadesOriginales[itemEliminado.IdMaterial];
      setCantidadesOriginales(nuevasCantidadesOriginales);
    }
  
    // Actualizar el estado removiendo el item
    setPrestamo({
      ...prestamo,
      Items: prestamo.Items.filter((_, i) => i !== index),
    });
  };
  

  const updateItem = (index: number, field: keyof LoanItem, value: number | string) => {
    setPrestamo({
      ...prestamo,
      Items: prestamo.Items.map((item, i) => {
        if (i === index) {
          if (field === "IdMaterial") {
            const selectedMaterial = material.find((m) => m.id === value);
            return {
              ...item,
              IdMaterial: value.toString(),
              Cantidad: selectedMaterial?.Disponibles || 0,
            };
          } else if (field === "Cantidad") {
            return { ...item, Cantidad: Number(value) };
          }
          return { ...item, [field]: value };
        }
        return item;
      }),
    });
    console.log(material);
  };  
  

  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-1/2 bg-white shadow-lg overflow-hidden sm:rounded-lg mb-8 border border-neutral-300 border-opacity-10">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 bg-primary/5">
          <h2 className="text-lg leading-6 font-medium text-dark flex items-center">
            <Package className="h-5 w-5 mr-2" />
            {Id === null ? "Agregar" : "Editar"} Préstamo
          </h2>
        </div>

        {/* Form */}
        <div className="px-6 py-5 border-t border-neutral/10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nombre del solicitante */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Solicitante</label>
                <input
                  type="text"
                  value={prestamo.Solicitante}
                  required
                  placeholder="Ingrese el nombre del solicitante"
                  className="block w-full rounded-md border border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                  onChange={(e) => setPrestamo({ ...prestamo, Solicitante: e.target.value })}
                />
              </div>

              {/* Materiales */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-dark">Materiales</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center px-3 py-1 text-sm text-primary hover:text-primary-light transition-colors"
                  >
                    <Plus size={16} className="mr-1" />
                    Agregar Material
                  </button>
                </div>
                <div className="space-y-3">
                  {prestamo.Items.map((item, index) => {
                    const selectedMaterial = material.find(m => m.id === item.IdMaterial);
                    const maxQuantity = selectedMaterial?.Disponibles || 0;

                    return (
                      <div key={index} className="flex gap-3 items-start p-3 bg-white rounded-lg border border-neutral/10">
                        <div className="flex-grow">
                          <select
                            required
                            className="block w-full rounded-md border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                            value={item.IdMaterial}
                            onChange={(e) => updateItem(index, 'IdMaterial', e.target.value)}
                          >
                            <option value="">Seleccionar material</option>
                            {material.map((m) => (
                              <option
                                key={m.id}
                                value={m.id}
                                disabled={m.Disponibles === 0 || (m.id !== item.IdMaterial && prestamo.Items.some(i => i.IdMaterial === m.id))}
                              >
                                {m.Nombre} (Disponibles: {m.Disponibles})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            max={maxQuantity}
                            required
                            className="block w-full rounded-md border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                            value={item.Cantidad}
                            onChange={(e) => updateItem(index, 'Cantidad', parseInt(e.target.value))}
                          />
                        </div>
                        {prestamo.Items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-neutral hover:text-dark transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fecha de préstamo */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Fecha de Préstamo</label>
                <input
                  type="date"
                  value={Id === null ? new Date().toISOString().split('T')[0]
                    : prestamo.FechaPrestamo?.toDate()?.toISOString().split('T')[0] || ''
                  }
                  required
                  className="block w-full rounded-md border border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                  onChange={(e) => setPrestamo({ ...prestamo, FechaPrestamo: Timestamp.fromDate(new Date(e.target.value)) })}
                />
              </div>

              {/* Fecha de devolución (opcional) */}
              {Id !== null && (
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Fecha de Devolución</label>
                  <input
                    type="date"
                    value={
                      prestamo.FechaDevolucion
                        ? prestamo.FechaDevolucion.toDate().toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                    className="block w-full rounded-md border border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                    onChange={(e) => {
                      const nuevaFecha = new Date(e.target.value);
                      setPrestamo({
                        ...prestamo,
                        FechaDevolucion: Timestamp.fromDate(nuevaFecha),
                      });
                    }}
                  />
                </div>
              )}

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Observaciones</label>
                <textarea
                  value={prestamo.Observaciones}
                  placeholder="Ingrese cualquier observación relevante"
                  rows={3}
                  className="block w-full rounded-md border border-neutral/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-light"
                  onChange={(e) => setPrestamo({ ...prestamo, Observaciones: e.target.value })}
                />
              </div>
            </div>
            {error !== "" && <p className="text-red-500 text-xs mt-2">{error}</p>}

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
                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-primary-light transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                Guardar Préstamo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormLoan;