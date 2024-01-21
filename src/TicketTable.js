import React from 'react';
import ticketTypes from './data/ticketTypes';
import { FaTrash, FaCopy, FaSave } from "react-icons/fa";

const TicketData = (props) => {
    let counter = 0;

    function handleEnterKey(e, index, field) {
        if (e.key === 'Enter') {
            e.preventDefault();
            props.handleCellBlur(e, index, field)
        }
    }

    function handleInputChange(e, index, field) {
        let value = e.target.value;
        props.updateTicketField(index, field, value);
      }   
      

    return (
        <table id="ticket-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Datum</th>
                    <th>Reise</th>
                    <th>Ticket-Art</th>
                    <th>Klasse</th>
                    <th>Reisende</th>
                    <th>Bahncard</th>
                    <th className='alignRight-sm'>Preis</th>
                    <th className='alignRight-sm'>Aktionen</th>
                </tr>
            </thead>
            <tbody>            
                {props.tickets.map((ticket, index) => {
                    counter++;
                    const date = new Date(ticket.journeyDate);
                    const isValidDate = !isNaN(date.getTime());
                    const formattedDate = isValidDate ? date.toISOString().substring(0, 10) : '';
                    
                    return (
                        <tr key={index}>
                            <td label="#" className="table-count"><span>{counter}</span></td>
                            <td label="Datum" className="table-date">
                                <input type="date" 
                                    onBlur={(e) => props.handleCellBlur(e, index, 'journeyDate')} 
                                    onKeyDown={(e) => handleEnterKey(e, index, 'journeyDate')} 
                                    onChange={(e) => handleInputChange(e, index, 'journeyDate')} 
                                    value={formattedDate} />
                            </td>
                            <td label="Reise" className="table-journey">
                                <textarea
                                    value={ticket.journey || ''} 
                                    onChange={(e) => handleInputChange(e, index, 'journey')}
                                    onBlur={(e) => props.handleCellBlur(e, index, 'journey')}
                                    placeholder="Reise (optional)"
                                    rows="1">
                                </textarea>
                            </td>

                            <td label="Ticket-Art" className="table-type">
                                <select value={ticket.ticketType} onChange={(e) => props.handleCellBlur(e, index, "ticketType")}>
                                    {Object.keys(ticketTypes).map((type) => {
                                        return <option key={type} value={type}>{type}</option>
                                    })}
                                </select>
                            </td>
                            <td label="Klasse" className="table-class">
                                <select value={ticket.ticketClass} onChange={(e) => props.handleCellBlur(e, index, "ticketClass")}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                            </td>
                            <td label="Reisende" className="table-travelers">
                                <select value={ticket.travelersCount} onChange={(e) => props.handleCellBlur(e, index, "travelersCount")}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                            <td label="BahnCard" className="table-bahncard">
                                <select value={ticket.bahncard} onChange={(e) => props.handleCellBlur(e, index, "bahncard")}>
                                    <option value="0">0</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </td>
                            <td label="Preis" className="price table-price alignRight-sm">
                                <input type="text" size="5" 
                                    onBlur={(e) => props.handleCellBlur(e, index, 'price')} 
                                    onKeyDown={(e) => handleEnterKey(e, index, 'price')} 
                                    onChange={(e) => handleInputChange(e, index, 'price')}
                                    value={ticket.price.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2})} />
                            </td>

                            <td label="Aktionen" className='alignRight-sm table-actions'>
                                <button aria-label="Fahrt kopieren" onClick={() => props.handleCopy(index)}>< FaCopy /></button>
                                <button aria-label="Fahrt löschen" onClick={() => props.handleDelete(index)}>< FaTrash /></button>
                            </td>
                        </tr>
                    )
                })}

                <tr key={counter + 1} className="addTicket">
                    <td label="#" className="table-count"></td>
                    <td label="Datum" className="addDate table-date">
                        <input type="date" 
                            onBlur={(e) => props.handleCellBlur(e, counter + 1, 'journeyDate')} />
                    </td>
                    <td label="Reise" className="addJourney table-journey">
                        <textarea
                            onChange={(e) => props.handleCellBlur(e, counter + 1, 'journey')}
                            onBlur={(e) => props.handleCellBlur(e, counter + 1, 'journey')}
                            placeholder="Reise (optional)"
                            rows="1">
                        </textarea>
                    </td>

                    <td label="Ticket-Art" className="table-type">
                        <select onChange={(e) => props.handleCellBlur(e, counter + 1, "ticketType")}>
                            {Object.keys(ticketTypes).map((type) => {
                                return <option key={type} value={type}>{type}</option>
                            })}
                        </select>
                    </td>
                    <td label="Klasse" className="table-class">
                        <select defaultValue="2" onChange={(e) => props.handleCellBlur(e, counter + 1, "ticketClass")}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </td>
                    <td label="Reisende" className="table-travelers">
                        <select defaultValue="1" onChange={(e) => props.handleCellBlur(e, counter + 1, "travelersCount")}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </td>
                    <td label="BahnCard" className="table-bahncard">
                        <select onChange={(e) => props.handleCellBlur(e, counter + 1, "bahncard")}>
                            <option value="25">0</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </td>
                    <td label="Preis" className="price alignRight-sm table-price">
                        <input type="number" 
                        onChange={(e) => props.handleCellBlur(e, counter + 1, "price")}
                        onKeyDown={(e) => e.key === 'Enter' && props.handleManualAdd(counter + 1)}
                        placeholder="0,00" size="5"/>
                    </td>

                    <td label="Aktionen" className='alignRight-sm table-actions'>
                        <button aria-label="Fahrt hinzufügen" onClick={() => props.handleManualAdd(counter + 1)}>< FaSave /></button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default TicketData;