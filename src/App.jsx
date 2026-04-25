import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { routerConfig } from './routes/routerConfig';

// We initialize the router with "Future Flags" to stop the console warnings
const router = createBrowserRouter(routerConfig, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

function App() {
  return (
    <AuthProvider>
      <RouterProvider 
        router={router} 
        // These flags on the provider itself ensure smooth transitions
        future={{ v7_startTransition: true }} 
      />
    </AuthProvider>
  );
}

export default App;