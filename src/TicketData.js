import React, { useState } from 'react';

const TicketData = (props) => {
    let counter = 0;

    return (
        <table>
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
                    const formattedDate = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
                    return (
                        <tr key={index}>
                            <td label="#">{counter}</td>
                            <td label="Date" contentEditable={true} onBlur={(e) => props.handleCellBlur(e, index, 'journeyDate')}>{formattedDate}</td>
                            <td label="Journey" contentEditable={true} onBlur={(e) => props.handleCellBlur(e, index, 'journey')}>{ticket.journey}</td>
                            <td label="Ticket Type" contentEditable={true} onBlur={(e) => props.handleCellBlur(e, index, "ticketType")}>{ticket.ticketType}</td>
                            <td label="Ticket Class" contentEditable={true} onBlur={(e) => props.handleCellBlur(e, index, "ticketClass")}>{ticket.ticketClass}</td>
                            <td label="Travelers Count" contentEditable={true} onBlur={(e) => props.handleCellBlur(e, index, "travelersCount")}>{ticket.travelersCount}</td>
                            <td label="Bahncard" contentEditable={true} onBlur={(e) => props.handleCellBlur(e, index, "bahncard")}>{ticket.bahncard}</td>
                            <td label="Price" className="price alignRight-sm" contentEditable={true} onBlur={(e) => props.handleCellBlur(e, index, "price")}>{ticket.price}</td>
                            <td label="Actions" className='alignRight-sm'>
                                <button onClick={() => props.handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}

export default TicketData;