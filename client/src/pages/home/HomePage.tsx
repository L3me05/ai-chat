function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section con immagine a tutta larghezza */}
            <div className="relative w-full h-96 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Hero background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-bold mb-4">Benvenuto su MySites</h1>
                        <p className="text-xl mb-8">La migliore piattaforma di utility</p>
                        <button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                            Inizia Ora
                        </button>
                    </div>
                </div>
            </div>

            {/* Sezione Features */}
            <div className="max-w-6xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Le nostre funzionalità</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🚀</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Veloce</h3>
                        <p className="text-gray-600">Lesgoski lesko</p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎨</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Personalizzabile</h3>
                        <p className="text-gray-600">Daje</p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📱</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Responsive</h3>
                        <p className="text-gray-600">Magari</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-sky-50 py-16">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Pronto a iniziare?</h2>
                    <p className="text-lg text-gray-600 mb-8">Unisciti a migliaia di utenti che hanno già creato il loro sito web perfetto</p>
                    <div className="space-x-4">
                        <button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                            Registrati Gratis
                        </button>
                        <button className="bg-white hover:bg-gray-50 text-sky-600 border-2 border-sky-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                            Accedi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;