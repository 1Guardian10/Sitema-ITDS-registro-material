import { Link, Outlet } from "react-router-dom";
//cabecera de la pagina
const Head = () => {
  return (
    <>
      <header style={{ backgroundColor: "#11223a" }} className="shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* titulo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Sistema de Préstamos de Materiales</h1>
            </div>

            {/* botones de navegacion */}
            <div className="hidden md:flex items-center justify-center space-x-4 mx-4">
              <Link to="/">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                  Inicio
                </button>
              </Link>
              <Link to="/materiales">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                  Materiales
                </button>
              </Link>
              <Link to="/prestamos">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                  Préstamos
                </button>
              </Link>
              <Link to="/reportes">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                  Reporte de prestamos
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Head;