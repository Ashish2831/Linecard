import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuth } from './hooks/useAuth';
import { CatalogueAskPage } from './pages/CatalogueAskPage';
import { CategoryPage } from './pages/CategoryPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { Loading } from './components/Status';
import { routerFuture } from './routerFuture';

export default function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="app-shell">
        <main>
          <Loading label="Starting Linecard…" />
        </main>
      </div>
    );
  }

  return (
    <BrowserRouter future={routerFuture}>
      <Routes>
        <Route
          element={
            <Layout
              user={user}
              onLogout={async () => {
                await logout();
              }}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="categories/:category" element={<CategoryPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="products/:id" element={<ProductDetailPage user={user} />} />
          <Route path="catalogue-ask" element={<CatalogueAskPage user={user} />} />
          <Route path="enquiry/thank-you" element={<ThankYouPage />} />
          <Route
            path="login"
            element={<LoginPage onLogin={(email, password) => login(email, password)} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
