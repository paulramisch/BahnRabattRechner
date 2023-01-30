import React, { useState } from 'react';
import ticketTypes from './data/ticketTypes';
import bahnCardTypes from "./data/bahnCardTypes";

const TicketSummary = ({tickets}) => {

  let totalPrice = 0;
  let totalUndiscountedPrice = 0;
  const bahnCardDiscounts = {};
  const bahnCardSavings = {};
  const ageGroups = ["6-18", "19-26", "27-64", "65+"];
  const ticketClasses = [1, 2];

  // State for the filter
  const [ageGroupFilter, setAgeGroupFilter] = useState(["27-64"]);
  const [ticketClassFilter, setTicketClassFilter] = useState([2]);  

  let filteredBahnCardTypes = Object.keys(bahnCardTypes).filter(id => {
    let bahnCard = bahnCardTypes[id];
    return ageGroupFilter.includes(bahnCard.ageGroup) && ticketClassFilter.includes(bahnCard.ticketClass);
  });
  

  // Iterate over the tickets
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
                  discount: bahnCardTypes[bahnCardType].discount,
              }
          }
  
          // Add the discounted price for the ticket to the total price for the BahnCard type
          bahnCardDiscounts[key].price += parseFloat(ticket.fullPrice) * (1 - maxDiscount);
          bahnCardDiscounts[key].savings = 0
      }
  });

  // Compute Savings
  for (const key in bahnCardDiscounts) {
    let savings = totalUndiscountedPrice - bahnCardTypes[key].price - bahnCardDiscounts[key].price
    bahnCardDiscounts[key].savings = savings.toFixed(2);
  }

  let maxSavingsId = ""
  if (Object.keys(bahnCardDiscounts).length > 0) {
    maxSavingsId = Object.entries(bahnCardDiscounts).reduce((maxId, [id, bahnCard]) => {
      if (bahnCard.savings > bahnCardDiscounts[maxId].savings) {
        return id;
      }
      return maxId;
    }, Object.keys(bahnCardDiscounts)[0]);  
  }
  console.log(maxSavingsId)

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
        <div className="filters row">

          <div className="filter-group col-6 col-sm-4">
            <h3>Altersgruppe</h3>
            {ageGroups.map((ageGroup) => (
              <label key={ageGroup} className={`filter-button ${ageGroupFilter.includes(ageGroup) ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  value={ageGroup}
                  onChange={handleAgeGroupFilter}
                  checked={ageGroupFilter.includes(ageGroup)}
                  className="filter-checkbox"
                />
                {ageGroup}
              </label>
            ))}
          </div>
          <div className="filter-group col-6 col-sm-4">
            <h3>Klasse</h3>
            {ticketClasses.map((ticketClass) => (
              <label key={ticketClass} className={`filter-button ${ticketClassFilter.includes(ticketClass) ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  value={ticketClass}
                  onChange={handleTicketClassFilter}
                  checked={ticketClassFilter.includes(ticketClass)}
                  className="filter-checkbox"
                />
                {ticketClass}. Klasse
              </label>
            ))}
          </div>
        </div>

        <div className="row"> 
        {filteredBahnCardTypes.map((id) => {
            let bahnCard = bahnCardTypes[id];
            let discount = bahnCard.discount;
            let price = bahnCard.price;
            let totalPrice = bahnCardDiscounts[id] ? bahnCardDiscounts[id].price : 0;
            let savings = bahnCardDiscounts[id] ? bahnCardDiscounts[id].savings : 0;
            let cardClass = id === maxSavingsId ? "highest-savings" : "";
            let negativeClass = savings < 0 ? 'negative-savings' : '';

            return (
                <div className="col-sm-4">
                    <div className={`card ${cardClass} ${negativeClass}`}>
                      <h3>{bahnCard.name}</h3>
                      <p><span className="tag">{bahnCard.ticketClass}. Klasse </span><span className="tag">{bahnCard.ageGroup} Jahre</span></p>
                      
                      <table>
                        <tbody>
                          <tr>
                            <td>Rabatt</td>
                            <td class="alignRight">{totalUndiscountedPrice - totalPrice} €</td>
                          </tr>
                          <tr>
                            <td>Preis</td>
                            <td class="alignRight">- {price} €</td>
                          </tr>
                          <tr className="result">
                            <td>Ersparnis</td>
                            <td class="alignRight">{savings} €</td>
                          </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
            );
        })}
        </div>
      </section>
    </div>
  );


}

export default TicketSummary;