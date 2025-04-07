export default function page() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Průměrné hodnoty získané od chovatelů:</h1>
        <p>Prosím, berte v potaz, že získané hodnoty jsou vypočteny na základě odpovědí získaných od 160 chovatelů drůbeže a 66 chovatelů králíků. Zároveň jsou ovlivněný extrémními hodnotami některých z respondentů. Data jsou aktuální k začátku roku 2025.</p>
        <h2 className="text-xl font-bold mt-6 mb-3">Drůbež:</h2>
        <p className="flex flex-col mb-3">
            <span className="font-semibold">Měsíční náklady na krmení:</span>
            Nejčastější odpověď byla 751-1000 Kč, vypočtený průměr je ale 1946 Kč.
        </p>
        <p className="flex flex-col mb-3">
            <span className="font-semibold">Roční náklady na vybavení - klece, snášková hnízda apod.:</span>
            Průměrná roční útrata je přibližně 2157 Kč.
        </p>
        <p className="flex flex-col mb-3">
            <span className="font-semibold">Měsíční náklady na veterinární péči:</span>
            Průměrná měsíční útrata činí 239 Kč.
        </p>
        <p className="flex flex-col mb-3">
            <span className="font-semibold">Roční náklady na pořízení zvířat:</span>
            Nejčastěji uváděnou odpovědí bylo 3001 a více Kč. Vypočtený průměr je 7034 Kč.
        </p>
        <ul className="flex flex-col gap-0.5">
            <li><strong>Průměrný měsíční příjem z prodeje masa:</strong> 1917,34 Kč</li>
            <li><strong>Průměrný měsíční příjem z prodeje vajec pro spotřebu:</strong> 1155,36 Kč</li>
            <li><strong>Průměrná prodejní cena 1 kg masa:</strong> 216 Kč</li>
            <li><strong>Průměrná prodejní cena 1 ks vejce:</strong> 7,12 Kč</li>
            <li><strong>Průměrný roční příjem z prodeje živých zvířat:</strong> 4556 Kč</li>
            <li><strong>Průměrný roční příjem z prodeje násadových vajec:</strong> 3110 Kč, ale více než 80 % chovatelů uvedlo nulový příjem.</li>
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-3">Králící:</h2>
        <p className="flex flex-col mb-3">
            <span className="font-semibold">Měsíční náklady na krmení:</span>
            Nejčastější odpověď byla 751-1000 Kč, vypočtený průměr je 1149 Kč.
        </p>
        <p className="flex flex-col mb-3">
            <span className="font-semibold">Roční náklady na vybavení - kotce/klece, misky, jesle apod.:</span>
            Průměrná roční útrata je přibližně 2180 Kč.
        </p>
        <p className="flex flex-col mb-3">
            <span className="font-semibold">Měsíční náklady na veterinární péči:</span>
            Průměrná měsíční útrata činí 253 Kč.
        </p>
        <p className="flex flex-col mb-3">
            <span className="font-semibold">Roční náklady na pořízení zvířat:</span>
            Nejčastěji uváděnou odpovědí bylo opět 3001 a více Kč. Průměrná hodnota ročních nákladů na pořízení zvířat je přibližně 1581 Kč.
        </p>
        <ul className="flex flex-col gap-0.5">
            <li><strong>Průměrný měsíční příjem z prodeje masa:</strong> 1002 Kč</li>
            <li><strong>Průměrná prodejní cena 1 kg masa:</strong> 159,24 Kč</li>
            <li><strong>Průměrný roční příjem z prodeje živých zvířat:</strong> 3400,57 Kč</li>
        </ul>
      </div>
    </div>
  )
}