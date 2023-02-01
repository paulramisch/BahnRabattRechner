// Hinfahrt: Matchgruppe, Aufteilung in Start und Ziel an dieser Stelle schwierig
export const outwardJourneyRegex = /Hinfahrt: ([^,]{0,100}) ,|([^\s,:]{3,30} -> [^\s.,:]{3,30})|e Reservierung ([^\d]{5,30}) \d/;

// Rückfahrt Matchgruppe keine Start-/Ziel-Aufteilung
export const returnJourneyRegex = /Rückfahrt: ([^,]{0,100}) ,|([^\s,:]{3,30} -> [^\s.,:]{3,30})|e Reservierung .{5,40}?\d (.{3,40})Gl./;

// Preis: Matchgruppe 1: Anzahl, Matchgruppe 2: Preis fürs Ticket, Reservierung außen vor
export const priceRegex = /Fahrkarte (\d\d?)? ?(.{2,10}?)€/;

// Klasse
export const ticketClassRegex = /Klasse: (\d)|-> .{3,20} (\d)/;

// Tag der Reise
// export const journeyDateRegex = /(?:Gültigkeit:.{0,10}?ab |Fahrtantritt am )([.\d]*?),? /;
export const journeyDateRegex = /(?:Gültigkeit:(?: | vom | am .{0,10}?|.{0,10}?ab )|Fahrtantritt am )([.\d]*?)(?:,?| Gilt) /;

// Art des Tickets, z.B. Flexticket, Sparpreis, Super Sparpreis, Supersparpreis EU
export const ticketTypeRegex = /(?:\d|\.) ([^\d.]{5,100}) Klasse|:\d\d[^:.]{3,20}\d([^:.]{3,50})Zahlungspositionen|[NG\d]G ([^\d]{6,30}?) \d|(Super Sparpreis EU)/;

// Bahncard-Rabatt?
export const bahncardRegex = /(?:\d) (?:BC ?)?(\d\d)? (?:Hinfahrt:|Zahlungspositionen)/;