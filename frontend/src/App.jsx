import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";
import Verify from "./pages/Verify";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import FarmerHome from "./pages/FarmerHome";
import MyListings from "./pages/MyListings";
import AddProduct from "./pages/AddProduct";
import Navbar from "./pages/Navbar";
import FarmerNavbar from "./pages/FarmerNavbar";
import ConsumerNavbar from "./pages/ConsumerNavbar"; 
import FarmToTableChat from "./components/chat";
import Consumer from "./pages/Consumer";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import RoutePage from "./components/RoutePage";
import RouteMap from "./components/RouteMap";
import AddToCart from "./components/AddToCart";
import Empty from "./pages/Empty";
import Account from "./pages/Account";
import Model from './pages/Model'
import OrderDetails from "./pages/OrderDetails";

import AdminLogin from "./pages/AdminLogin";
import UserOrdersPage from "./components/RouteMap";
import OrderList from "./components/RouteMap";

import Delivery from "./pages/Delivery";
import DeliveryNavbar from "./components/Delivery-Navbar";
import FarmerOrders from "./pages/FarmerOrders";

import VerifyFarmer from "./pages/VerifyFarmer";
import VerifyDelivery from "./pages/VerifyDelivery";
import AdminDashboard from "./pages/NewAdmin";
import DeliveryBoyDashboard from "./pages/newDelivery";
import FarmerLearnMore from "./pages/FarmerLearn";
import ConsumerLearnMore from "./pages/ConsumerLearn";
import PredictPrice from "./pages/model1";
import VegetablePricePredictor from "./pages/model1";
import VegetableDemandPredictor from "./pages/Model2";
import Admin from "./pages/Admin";
import AdminNavbarNew from "./pages/AdminNavbarNew";
import LandingPage from "./pages/try";
import ThreeDLandingPage from "./pages/try";
import Predict from "./pages/Predict";
import PredictionMenu from "./pages/PredictionMenu";

const App = () => {
  const { user, loading, isAuth,isAuthAdmin } = UserData();
  console.log(isAuthAdmin);
  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <AppWithLocation user={user} isAuth={isAuth} isAuthAdmin={isAuthAdmin} />
    </BrowserRouter>
  );
};

const AppWithLocation = ({ user, isAuth ,isAuthAdmin}) => {
  const location = useLocation();

  // Determine which navbar to display
  const showFarmerNavbar = isAuth && user.role === "farmer";
  const showConsumerNavbar = isAuth && user.role === "customer";
  const showDeliveryNavbar = isAuth && user.role === "delivery boy";
  const showAdminNavbar = isAuthAdmin;

  return (
    <>
      {/* Conditionally render navbar */}
      {showFarmerNavbar ? (
        <FarmerNavbar />
      ) : showConsumerNavbar ? (
        <ConsumerNavbar />
      ) : showDeliveryNavbar ? (
        <DeliveryNavbar />
      ) :showAdminNavbar?(
        <AdminNavbarNew/>
      ) :(
        <Empty />
      )}

      <Routes>
        <Route
          path="/"
          element={
            isAuth ? (
              user.role === "farmer" ? (
                <Navigate to="/farmer" />
              ) : user.role === "delivery boy" ? (
                <Navigate to="/delivery" />
              ) : (
                <Navigate to="/consumer" />
              )
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuth ? (
              user.role === "farmer" ? (
                <Navigate to="/farmer" />
              ) : user.role === "delivery boy" ? (
                <Navigate to="/delivery" />
              ) : (
                <Navigate to="/consumer" />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuth ? (
              user.role === "farmer" ? (
                <Navigate to="/farmer" />
              ) : user.role === "delivery boy" ? (
                <Navigate to="/delivery" />
              ) : (
                <Navigate to="/consumer" />
              )
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/farmer"
          element={isAuth && user.role === "farmer" ? <FarmerHome /> : <Navigate to="/" />}
        />
        <Route
          path="/consumer"
          element={isAuth && user.role === "customer" ? <Consumer /> : <Navigate to="/" />}
        />
        <Route
          path="/delivery"
          element={isAuth && user.role === "delivery boy" ? <Delivery /> : <Navigate to="/" />}
        />
        
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<Reset />} />
        <Route path="/mylistings" element={isAuth && user.role === "farmer" ? <MyListings user={user} /> : <Home />} />
        <Route path="/addproduct" element={isAuth && user.role === "farmer" ? <AddProduct /> : <Home />} />
        <Route path="/cart" element={isAuth && user.role === "customer" ? <CartPage /> : <Home />} />
        <Route path="/past-orders" element={isAuth && user.role === "customer" ? <OrderPage /> : <Home />} />
        <Route path="/order" element={isAuth && user.role === "customer" ? <OrderDetails /> : <Home />} />
        <Route path="/orders" element={isAuth && user.role === "customer" ? <OrderList /> : <Home />} />
        <Route  path="/model" element={isAuth && user.role === "farmer" ? <Model /> : <Home />} />
        <Route path="admin-login" element={isAuth && user.role === "admin" ? <AdminLogin /> : <Home />} />
        <Route path="verify-farmer" element={isAuth && user.role === "admin" ? <AdminDashboard /> : <Home />} />
        <Route path="/farmerorder" element={isAuth && user.role === "farmer" ? <FarmerOrders /> : <Home />} />  
        <Route path="/learnFarmer" element={isAuth && user.role === "farmer" ? <FarmerLearnMore /> : <Home />} />  
        <Route path="/learnConsumer" element={isAuth && user.role === "customer" ? <ConsumerLearnMore /> : <Home />} />  
        <Route path="/order" element={<OrderDetails />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/model" element={<PredictionMenu />} />
        <Route path="/admin-login" element={isAuthAdmin?<AdminDashboard/>: <AdminLogin/> } />
        
        <Route path="/farmerorder" element={<FarmerOrders />} />
        <Route path="/chat" element={<FarmToTableChat />} />
        <Route path="/verify" element={<VerifyFarmer />} />
        <Route path="/verify-delivery" element={<VerifyDelivery />} />
        <Route path="/admin" element={isAuthAdmin?<AdminDashboard />:<AdminLogin/>} />
        <Route path="/admin123" element={isAuthAdmin?<Admin />:<AdminLogin/>} />
        <Route path="/newdelivery" element={<DeliveryBoyDashboard />} />
        <Route path="/model1" element={<VegetablePricePredictor/>} />
        <Route path="/model2" element={<VegetableDemandPredictor/>} />
        <Route path="/predict" element={<PredictionMenu/>} />
        <Route path="/try" element={<ThreeDLandingPage/>} />
        

      </Routes>
    </>
  );
};

export default App;
