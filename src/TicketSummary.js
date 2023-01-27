import React, { useState } from 'react';
import ticketTypes from './data/ticketTypes';
import bahnCardTypes from "./data/bahnCardTypes";
import { CSSTransition } from 'react-transition-group';

const TicketSummary = ({tickets}) => {
  let totalPrice = 0;
  let totalUndiscountedPrice = 0;
  const bahnCardDiscounts = {};

  // State for the filter
  const [ageGroupFilter, setAgeGroupFilter] = useState([]);
  const [ticketClassFilter, setTicketClassFilter] = useState([]);

  let filteredBahnCardTypes = Object.keys(bahnCardTypes).filter(id => {
    let bahnCard = bahnCardTypes[id];
    return ageGroupFilter.includes(bahnCard.ageGroup) && ticketClassFilter.includes(bahnCard.ticketClass);
  });

  tickets.forEach(ticket => {
      totalPrice += parseFloat(ticket.price);
      totalUndiscountedPrice += parseFloat(ticket.fullPrice);
  
      // Get the max discount for the ticket type
      let maxDiscount = ticketTypes[ticket.ticketType] || 1;
  
      // Iterate over every BahnCard type
      for (let bahnCardType of Object.keys(bahnCardTypes)) {
          let discount = bahnCardTypes[bahnCardType].discount;
          let key = bahnCardType
  
          // Check if the BahnCard type has a higher discount than the max discount
          if (discount < maxDiscount) {
              maxDiscount = discount;
          }
          
          // If Bahncard 100 maxDiscount is 100% even for Sparpreis
          maxDiscount = discount == 1 ? 1 : maxDiscount;
  
          // Initialize the total price for the BahnCard type if it hasn't been set yet
          if (!bahnCardDiscounts[key]) {
              bahnCardDiscounts[key] = {
                  id: key,
                  price: 0,
                  discount: bahnCardTypes[bahnCardType].discount
              }
          }
  
          // Add the discounted price for the ticket to the total price for the BahnCard type
          bahnCardDiscounts[key].price += parseFloat(ticket.fullPrice) * (1 - maxDiscount);

      }
  });

  // Function to handle the ageGroup filter
  const handleAgeGroupFilter = (event) => {
    if (event.target.checked) {
        setAgeGroupFilter([...ageGroupFilter, event.target.value]);
    } else {
        setAgeGroupFilter(ageGroupFilter.filter(f => f !== event.target.value));
    }
  };


  // Function to handle the ticketClass filter
  const handleTicketClassFilter = (event) => {
      if (event.target.checked) {
          console.log(event.target.value)
          setTicketClassFilter([...ticketClassFilter, parseInt(event.target.value)]);
      } else {
          setTicketClassFilter(ticketClassFilter.filter(f => f !== parseInt(event.target.value)));
      }
  };

  return (
    <div>
      <div className="priceSummary">
        <p>Gesamtpreis: {totalPrice}<br/>Gesamtpreis ohne BahnCard-Rabatte: {totalUndiscountedPrice}</p>
      </div>

      <section id="result">
        <h2>Ergebnisse</h2>

        <div className="filters">
          <label>
            <input type="checkbox" value="6-18" onChange={handleAgeGroupFilter} />6-18
          </label>
          <label>
            <input type="checkbox" value="19-26" onChange={handleAgeGroupFilter} />19-26
          </label>
          <label>
            <input type="checkbox" value="27-64" onChange={handleAgeGroupFilter} />27-64
          </label>
          <label>
            <input type="checkbox" value="65+" onChange={handleAgeGroupFilter} />65+
          </label>
          <br />
          <label>
            <input type="checkbox" value="1" onChange={handleTicketClassFilter} />1. Klasse
          </label>
          <label>
            <input type="checkbox" value="2" onChange={handleTicketClassFilter}  />2. Klasse
          </label>
        </div>


        <div className="cards"> 
        {filteredBahnCardTypes.map((id) => {
            let bahnCard = bahnCardTypes[id];
            let discount = bahnCard.discount;
            let price = bahnCard.price;
            let totalPrice = bahnCardDiscounts[id] ? bahnCardDiscounts[id].price : 0;

            return (
                <div className="card">
                    <h3>{bahnCard.name}</h3>
                    <p>{bahnCard.ticketClass} Klasse | {bahnCard.ageGroup} Jahre</p>
                    <p>Rabatt: {totalUndiscountedPrice - totalPrice} €</p>
                    <p>Preis: {price} €</p>
                    <p>Ersparniss: {totalUndiscountedPrice - totalPrice - price} €</p>
                </div>
            );
        })}
        </div>
      </section>
    </div>
  );


}

export default TicketSummary;