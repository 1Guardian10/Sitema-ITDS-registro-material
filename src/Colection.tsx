import { Timestamp } from "firebase/firestore";

//modelo para la coleccion material de laboratorio y topografia
export interface Material {
  id: string;
  Nombre: string;
  Disponibles:number;
  Descripcion:string;
  Estado:boolean;
  Total:number;
}

//mini lista de materiales
export interface LoanItem {
  IdMaterial: string;
  Cantidad: number;
}

//modelo para la coleccion prestamos
export interface Prestamos{
  id: string;
  FechaDevolucion?: Timestamp;
  FechaPrestamo: Timestamp;
  Observaciones: string;
  Solicitante: string;
  Estado: boolean;
  Items: LoanItem[];
}