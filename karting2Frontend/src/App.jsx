import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import ClientRegister from './components/ClientRegister';
import Home from './components/Home';
import KartBookingForm from './components/KartBookingForm';
import Navegate from './components/Navegate';
import RackWeekly from './components/RackWeekly';
import StatusKartBooking from './components/StatusKartBooking';
import Reports from './components/Reports';
import Information from './components/Information';
import PaymentConfirmation from './components/PaymentConfirmation';
import AdminLogin from './components/AdminLogin';

function App() {
  return (
      <Router>
          {/* Header */}
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            zIndex: 1100,
            }}
          >
            <Navegate />
          </div>
          {/* Contenido principal */}
          <div className="container" style={{ marginTop: '20px', padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path='/kartBookingForm' element={<KartBookingForm/>} />
              <Route path="/clientRegister" element={<ClientRegister/>} />
              <Route path="/rackWeekly" element={<RackWeekly/>} />
              <Route path="/statusKartBooking" element={<StatusKartBooking/>} />
              <Route path="/reports" element={<Reports/>} />
              <Route path="/information" element={<Information/>} />
              <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
          </div>
      </Router>
  );
}

export default App