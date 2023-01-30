class Ticket {
  constructor(outwardJourney, returnJourney, journey, price, fullPrice, ticketClass, travelersCount, journeyDate, ticketType, bahncard, ticketText) {
    this.outwardJourney = outwardJourney;
    this.returnJourney = returnJourney;
    this.journey = journey;
    this.price = price;
    this.fullPrice = fullPrice;
    this.ticketClass = ticketClass;
    this.travelersCount = travelersCount;
    this.journeyDate = journeyDate;
    this.ticketType = ticketType;
    this.bahncard = bahncard;
    this.ticketText = ticketText;
  }
}

export default Ticket;