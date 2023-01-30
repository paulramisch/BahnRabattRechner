import React, { useState } from 'react';
import ticketTypes from './data/ticketTypes';
import bahnCardTypes from "./data/bahnCardTypes";

const TicketSummary = ({tickets}) => {

  let totalPrice = 0;
  let totalUndiscountedPrice = 0;
  const bahnCardDiscounts = {};
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
      totalUndiscountedPrice += (parseFloat(ticket.fullPrice) / ticket.travelersCount);
  
      // Get the max discount for the ticket type
      let maxDiscount = ticketTypes[ticket.ticketType] || 1;
  
      // Iterate over every BahnCard type
      for (let bahnCardType of Object.keys(bahnCardTypes)) {
          let bahnCardClass = bahnCardTypes[bahnCardType].ticketClass;
          let discount = bahnCardTypes[bahnCardType].discount;
          let key = bahnCardType

          // Check if the BahnCard is applipicable
          if (ticket.ticketClass == 1 && bahnCardClass == 1) 
          {
            maxDiscount = 0
          } else {
            // Check if the BahnCard type has a higher discount than the max discount
            if (discount < maxDiscount) {
              maxDiscount = discount;
            }
          
            // If Bahncard 100 maxDiscount is 100% even for Sparpreis
            maxDiscount = discount == 1 ? 1 : maxDiscount;
          }
  
          // Initialize the total price for the BahnCard type if it hasn't been set yet
          if (!bahnCardDiscounts[key]) {
              bahnCardDiscounts[key] = {
                  id: key,
                  price: 0,
                  discount: bahnCardTypes[bahnCardType].discount,
              }
          }

          // Calculate price per person
          let fullPricePerPerson = parseFloat(ticket.fullPrice) / ticket.travelersCount
  
          // Add the discounted price for the ticket to the total price for the BahnCard type
          bahnCardDiscounts[key].price += fullPricePerPerson * (1 - maxDiscount);
          bahnCardDiscounts[key].savings = 0
      }
  });

  // Compute Savings
  for (const key in bahnCardDiscounts) {
    let savings = (totalUndiscountedPrice) - bahnCardTypes[key].price - bahnCardDiscounts[key].price
    bahnCardDiscounts[key].savings = savings;
  }

  // Set best deal
  var maxSavingsIdObject = Object.values(bahnCardDiscounts);
  maxSavingsIdObject.sort((a, b) => b.savings - a.savings);
  let filteredBahnCardDiscounts = Object.values(maxSavingsIdObject).filter(maxSavingsIdObject => filteredBahnCardTypes.includes(maxSavingsIdObject.id));
  let maxSavingsId = filteredBahnCardDiscounts[0] ? filteredBahnCardDiscounts[0].id : "";
  let maxSavingsInfo = filteredBahnCardDiscounts[0] ? bahnCardTypes[maxSavingsId].name + " " + bahnCardTypes[maxSavingsId].ticketClass + ". Klasse" : "";

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
        { maxSavingsInfo !== "" && filteredBahnCardDiscounts[0].savings > 0 && (
        <p>Für Deine Fahrten im vergangenen Jahr hast Du das größte Kostensparpotenzial mit der {maxSavingsInfo}, mit dieser kannst Du {filteredBahnCardDiscounts[0].savings.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} sparen.</p>)
        }
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
            let cardClass = id == maxSavingsId ? "highest-savings" : "";
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
                            <td className="alignRight">{(totalUndiscountedPrice - totalPrice).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                          </tr>
                          <tr>
                            <td>Preis</td>
                            <td className="alignRight">- {price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                          </tr>
                          <tr className="result">
                            <td>Ersparnis</td>
                            <td className="alignRight">{savings.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
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