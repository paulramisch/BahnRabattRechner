// Hinfahrt: Matchgruppe, Aufteilung in Start und Ziel an dieser Stelle schwierig
export const outwardJourneyRegex = /(?: Einfache Fahrt|Hinfahrt) ([^,]{0,100}) Via|Hinfahrt: ([^,]{0,100}) ,|([^\s,:]{3,30} -> [^\s.,:]{3,30})|e Reservierung ([^\d]{5,30}) \d/;

// Rückfahrt Matchgruppe keine Start-/Ziel-Aufteilung
export const returnJourneyRegex = /Rückfahrt ([^,]{0,100}) Via|Rückfahrt: ([^,]{0,100}) ,|([^\s,:]{3,30} -> [^\s.,:]{3,30})|e Reservierung .{5,40}?\d (.{3,40})Gl./;

// Preis Matchgruppe 1: Preis fürs Ticket
// Alt: Summe, Neu: Gesamtpreis
export const priceRegex = /(?:Summe|Gesamtpreis) ?(.{2,10}?)€/;

// Anzahl Reisende
// Alt: Erw.|Personen:, Neu: Reisender
export const numTravelers = /(?:Erw:|Personen:|Reisender?) (\d\d?)|(\d\d?) (?:Erwachsener)/;

// Klasse
export const ticketClassRegex = /Klasse:? (\d)|-> .{3,20} (\d)/;

// Tag der Reise
// export const journeyDateRegex = /(?:Gültigkeit:.{0,10}?ab |Fahrtantritt am )([.\d]*?),? /;
export const journeyDateRegex = /(?:Gültigkeit:(?: | vom | am .{0,10}?|.{0,10}?ab )|Fahrtantritt am )([.\d]*?)(?:,?| Gilt) /;

// Art des Tickets, z.B. Flexticket, Sparpreis, Super Sparpreis, Supersparpreis EU
export const ticketTypeRegex = /(?:\d|\.) ([^\d.]{5,100}) Klasse|:\d\d[^:.]{3,20}\d([^:.]{3,50})Zahlungspositionen|[NG\d]G ([^\d]{6,30}?) \d|(Super ?Sparpreis)/;

export const ticketCategoryRegex = /(Flexpreis|Normalpreis|Sparpreis|Super ?Sparpreis)/;

// Bahncard-Rabatt?
export const bahncardRegex = /(?:BC ?)(\d\d)/;