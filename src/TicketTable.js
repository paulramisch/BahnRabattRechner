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
                            <td label="#" className="table-count">{counter}</td>
                            <td label="Datum" className="table-date">
                                <input type="date" onBlur={(e) => props.handleCellBlur(e, index, 'journeyDate')} onKeyDown={(e) => handleEnterKey(e, index, 'journeyDate')} value={formattedDate}/>
                            </td>
                            <td className="table-journey">
                                <p contentEditable={true} onBlur={(e) => props.handleCellBlur(e, index, 'journey')} placeholder="Reise (optional)">{ticket.journey}</p>
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
                                    <option value="100">100</option>
                                </select>
                            </td>
                            <td label="Preis" className="price table-price alignRight-sm">
                                <input type="text" size="5" placeholder="0" onBlur={(e) => props.handleCellBlur(e, index, 'price')} onKeyDown={(e) => handleEnterKey(e, index, 'price')} 
                                value={ticket.fullPrice.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/>
                            </td>
                            <td className='alignRight-sm table-actions'>
                                <button onClick={() => props.handleCopy(index)}>< FaCopy /></button>
                                <button onClick={() => props.handleDelete(index)}>< FaTrash /></button>
                            </td>
                        </tr>
                    )
                })}

                <tr key={counter + 1} className="addTicket">
                    <td label="#" className="table-count"></td>
                    <td className="addDate table-date">
                        <input type="date" onBlur={(e) => props.handleCellBlur(e, counter + 1, 'journeyDate')} />
                    </td>
                    <td className="addJourney table-journey">
                        <p contentEditable={true} onBlur={(e) => props.handleCellBlur(e, counter + 1, 'journey', e.target.innerText)} placeholder="Reise (optional)"></p>
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
                            <option value="1" >1</option>
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
                            <option value="100">100</option>
                        </select>
                    </td>
                    <td label="Preis" className="price alignRight-sm table-price">
                        <input type="number" onChange={(e) => props.handleCellBlur(e, counter + 1, "price")} placeholder="0,00" size="5"/>
                    </td>
                    <td className='alignRight-sm table-actions'>
                        <button onClick={() => props.handleManualAdd(counter + 1)}>< FaSave /></button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default TicketData;