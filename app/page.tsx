export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="font-fancy text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-50 via-slate-200 to-purple-200">
          Sorteo Finalizado
        </h1>
        <p className="text-text-secondary text-base leading-relaxed">
          Gracias por tu interés en la Rifa del Ford LTD Crown Victoria. En este momento no estamos aceptando más participantes.
        </p>
        <p className="text-text-muted text-sm mt-6">
          Para dudas, contáctanos por WhatsApp.
        </p>
      </div>
    </main>
  );
}
