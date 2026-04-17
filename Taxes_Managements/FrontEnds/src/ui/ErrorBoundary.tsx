import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error("Route Error:", error);

  let errorMessage = "Une erreur inattendue s'est produite.";
  if (isRouteErrorResponse(error)) {
    errorMessage = error.status === 404 ? "Cette page n'existe pas." : error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-error/10 text-center">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">warning</span>
        </div>
        <h1 className="text-2xl font-black text-on-surface mb-2">Oups !</h1>
        <p className="text-stone-500 mb-8">{errorMessage}</p>
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl bg-primary text-white font-black hover:bg-primary-dark transition-all active:scale-95 mb-3"
        >
          Retour
        </button>
        <Link 
          to="/"
          className="inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl bg-surface-container-high text-primary font-black hover:bg-surface-container transition-all active:scale-95"
        >
          Aller à l'accueil
        </Link>
      </div>
    </div>
  );
}
