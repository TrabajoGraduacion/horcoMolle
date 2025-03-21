import '../src/App.css'
import { AuthProvider } from '../context/AuthContext';
import Routes from './components/routes/Routes.jsx';
import Administrador from './components/views/user/Administrador';
import Hojita from './components/views/offer/Hojita';
import "bootstrap/dist/css/bootstrap.min.css";
import EditUserModal from './components/views/user/EditUserModal';
import Supplier from './components/views/supplier/Supplier';
import Product from './components/views/product/Product';
import { FichaClinicaProvider } from '../context/FichaClinicaContext';

export const App = () => {
  return (
    <FichaClinicaProvider>
      <AuthProvider> 
        <Routes></Routes>
      </AuthProvider>
    </FichaClinicaProvider>
  );
};
