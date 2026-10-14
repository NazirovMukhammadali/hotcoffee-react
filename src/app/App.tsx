import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import HomePage from './screens/homePage';
import ProductsPage from './screens/productsPage';
import OrdersPage from './screens/ordersPage';
import UsersPage from './screens/usersPage';
import Navbar from './components/headers/Navbar';
import Footer from './components/footer';
import HelpPage from './screens/helpPage';
import useBasket from './hooks/useBasket';
import AuthenticationModal from './components/auth';
import { Messages } from '../lib/config';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../lib/sweetAlert';
import MemberService from './services/MemberService';
import { useGlobals } from './hooks/useGlobals';
import { CartItem } from '../lib/types/search';
import "../css/navbar.css";
import "../css/footer.css";

function App() {
  const location = useLocation();
  const history = useHistory();
  const { setAuthMember } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // sahifa almashganda tepaga
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // HANDLERS
  const handleAuthClose = () => setAuthOpen(false);
  const handleLogoutClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseLogout = () => setAnchorEl(null);

  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout();
      setAuthMember(null);
      history.push("/");
      sweetTopSmallSuccessAlert("Signed out. See you soon!", 1500);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(Messages.error1);
    }
  };

  const addToBasket = (item: CartItem) => {
    onAdd(item);
    sweetTopSmallSuccessAlert(`${item.name} added to basket`, 1200);
  };

  return (
    <>
      <Navbar
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
        onDelete={onDelete}
        onDeleteAll={onDeleteAll}
        setAuthOpen={setAuthOpen}
        anchorEl={anchorEl}
        handleLogoutClick={handleLogoutClick}
        handleCloseLogout={handleCloseLogout}
        handleLogoutRequest={handleLogoutRequest}
      />
      <main>
        <Switch>
          <Route path="/products">
            <ProductsPage onAdd={addToBasket} />
          </Route>
          <Route path="/orders">
            <OrdersPage />
          </Route>
          <Route path="/member-page">
            <UsersPage />
          </Route>
          <Route path="/help">
            <HelpPage />
          </Route>
          <Route path="/">
            <HomePage onAdd={addToBasket} setAuthOpen={setAuthOpen} />
          </Route>
        </Switch>
      </main>
      <Footer />

      <AuthenticationModal authOpen={authOpen} onClose={handleAuthClose} />
    </>
  );
}

export default App;
