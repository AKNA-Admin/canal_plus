export default function Navbar() {
  return (
    <header className="bg-black text-white p-4 flex items-center gap-3 shadow-lg">
      <img src="https://res.cloudinary.com/zpy0qbjp/image/upload/v1786037223/icon_my_App_PDV_dekfzu.jpg" alt="Canal+" className="h-8" /> {/* AJOUTE ÇA */}
      <h1 className="text-xl font-bold">PDV Manager</h1>
      <div className="ml-auto">
        {/* Bouton logout etc */}
      </div>
    </header>
  )
}
