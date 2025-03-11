import { collection, addDoc, updateDoc, doc ,getDocs, getDoc } from "firebase/firestore";
import db from "../DB/Firebase";

// Obtener el documento de la base de datos
export const getDocument = async <T = any>(nameDocument: string): Promise<(T & { id: string })[]> => {
  try {
      const querySnapshot = await getDocs(collection(db, nameDocument));

      const listaMaterial = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
      })) as (T & { id: string })[];

      return listaMaterial;
  } catch (error) {
      console.error(`Error obteniendo los datos de la colección "${nameDocument}":`, error);
      return [];
  }
};

// Obtener un documento específico por ID
export const getDocumentById = async <T = any>(nameDocument: string, id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, nameDocument, id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data() as T;
      } else {
        console.log("No existe el documento con ID:", id);
        return null;
      }
    } catch (error) {
      console.error(`Error obteniendo el documento con ID "${id}" de la colección "${nameDocument}":`, error);
      return null;
    }
  };

// Insertar un nuevo documento en la base de datos
export const insertDocument = async (nameDocument: string, data: object) => {
  try {
      const docRef = await addDoc(collection(db, nameDocument), data);
      console.log("Documento agregado con ID:", docRef.id);
      return docRef.id;
  } catch (error) {
      console.error("Error insertando el documento:", error);
      return null;
  }
};

// Actualizar un documento en Firestore
export const updateDocument = async <T = any>(nameDocument: string, id: string, data: Partial<T>) => {
  try {
      const docRef = doc(db, nameDocument, id);
      await updateDoc(docRef, data);
      console.log("Documento actualizado:", id);
      return true;
  } catch (error) {
      console.error("Error actualizando el documento:", error);
      return false;
  }
};