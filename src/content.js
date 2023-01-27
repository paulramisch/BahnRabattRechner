import React from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import TicketData from './TicketData';
import Ticket from './Ticket';
import TicketSummary from './TicketSummary';
import * as regex from './regex';
import InvalidFileNote from './InvalidFileNote';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: '',
      tickets: [],
      invalidFiles: []
    };
  }

  submit = async (ev) => {
    ev.preventDefault();
    if (this.state.files) {
      for (let file of this.state.files) {
        // Empty errors
        this.setState({  invalidFiles: [] });
        
        // Create reader
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.addEventListener("load", async () => {
            var pdfData = await pdfjsLib.getDocument({ data: new Uint8Array(reader.result) }).promise;
            var page = await pdfData.getPage(1);
            var textContent = await page.getTextContent();
            var ticketText = textContent.items.map(item => item.str).join(" ").replace(/\s+/g, ' ');

            // Match ticket data
            var outwardJourneyMatch = ticketText.match(regex.outwardJourneyRegex);
            var returnJourneyMatch = ticketText.match(regex.returnJourneyRegex);
            var priceMatch = ticketText.match(regex.priceRegex);
            var ticketClassMatch = ticketText.match(regex.ticketClassRegex);
            var journeyDateMatch = ticketText.match(regex.journeyDateRegex);
            var ticketTypeMatch = ticketText.match(regex.ticketTypeRegex);
            var bahncardMatch = ticketText.match(regex.bahncardRegex);

            // Extract ticket data
            var outwardJourney = outwardJourneyMatch ? outwardJourneyMatch[1] || outwardJourneyMatch[2] : "";
            var returnJourney = returnJourneyMatch ? returnJourneyMatch[1] : "";
            var price = priceMatch ? parseInt(priceMatch[2]) : 0;
            var ticketClass = ticketClassMatch ? parseInt(ticketClassMatch[1]) || parseInt(ticketClassMatch[2]) : 2;
            var travelersCount = priceMatch ? parseInt(priceMatch[1]) : 1;
            var journeyDate = journeyDateMatch ? new Date(journeyDateMatch[1].split(".").reverse().join("-")) : "";
            var ticketType = ticketTypeMatch ? ticketTypeMatch[1] || ticketTypeMatch[2] || ticketTypeMatch[3] : "";
            var bahncard = bahncardMatch ? parseInt(bahncardMatch[1]) : 0;

            // Clean data
            outwardJourney = outwardJourney.replace(/\+City/g, '').replace(" -> ", ' ').replace(/\s/g, ' - ')
            returnJourney = returnJourney != "" ? returnJourney.replace(/\+City/g, '').replace(" -> ", '').replace(/\s/g, ' - ') : "";
            ticketType = ticketType.replace(" (Einfache Fahrt)", '').replace(" (Hin- und Rückfahrt)", '').replace(/ \d.*/g, '')
            var journey = returnJourney == "" ? outwardJourney : outwardJourney + ", " + returnJourney

            // Check if outwardJourney and journeyDate are empty
            if (outwardJourney === "" || journeyDate === "") {
              this.setState(state => {
                return { invalidFiles: [...state.invalidFiles, file.name] };
              });
              return;
            }

            // Calculate discounted price
            if (ticketType.includes("Flexpreis") && parseInt(bahncard) >= 25) {
              var fullPrice =  Math.round(parseFloat(price) / (1 - parseInt(bahncard) / 100));
            } else if (!ticketType.includes("Flexpreis") && parseInt(bahncard) >= 25) {
              var fullPrice =  Math.round(parseFloat(price) / 0.75);
            } else {
              var fullPrice = parseFloat(price);
            }

            // Create new ticket class
            var newTicket = new Ticket(
              outwardJourney, returnJourney, journey, price, fullPrice, ticketClass, travelersCount, journeyDate, ticketType, bahncard, ticketText);

            this.setState(state => {
              // Sort the tickets by journeyDate
              var tickets = [...state.tickets, newTicket].sort((a, b) => new Date(a.journeyDate) - new Date(b.journeyDate));
              return { tickets: tickets, files: '' };
            });
          }, false);
      }
    }
  };

  handleChange = (event) => {
    this.setState({ files: event.target.files });
  };

  handleDelete = (index) => {
    this.setState(state => {
        state.tickets.splice(index, 1);
        return { tickets: state.tickets }
    });
  }

  handleCloseInvalidFileNote = () => {
    this.setState({ invalidFiles: [] });
  }

  handleCellBlur = (e, index, key) => {
    this.setState(state => {
      let updatedTicket = {...state.tickets[index]};  // create a copy of the ticket
      updatedTicket[key] = e.target.innerText;  // update the appropriate key with the new value  
      let updatedTickets = state.tickets;
      updatedTickets[index] = updatedTicket;  // update the appropriate ticket
      return { tickets: updatedTickets }
    });
  }

  render() {
    return (
      <div>
        {this.state.invalidFiles.length > 0 && <InvalidFileNote files={this.state.invalidFiles} handleCloseInvalidFileNote={this.handleCloseInvalidFileNote} />}
        <TicketData tickets={this.state.tickets} handleDelete={this.handleDelete} handleCellBlur={this.handleCellBlur} />        
        <form onSubmit={this.submit} className="fileForm">
          <input onChange={this.handleChange} type="file" id="tickets" multiple/>
          <input type="submit" value="Send" />
        </form>
        <TicketSummary tickets={this.state.tickets.sort((a, b) => new Date(a.journeyDate) - new Date(b.journeyDate))} />
      </div>
    );
  }

};
