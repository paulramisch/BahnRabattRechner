import React from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import TicketTable from './TicketTable';
import Ticket from './entities/Ticket';
import TicketSummary from './TicketSummary';
import * as regex from './regex';
import InvalidFileNote from './InvalidFileNote';
import moment from 'moment';
import { FaFilePdf } from "react-icons/fa";


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.body = document.querySelector("body");
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.state = {
      files: '',
      tickets: [],
      invalidFiles: [],
      tempTicket: {}
    };
  }

  componentDidMount() {
    this.body.addEventListener('drop', this.handleDrop);
    this.body.addEventListener('dragover', this.handleDragOver);
    this.body.addEventListener('dragleave', this.handleDragLeave);
  }

  componentWillUnmount() {
    this.body.removeEventListener('drop', this.handleDrop);
    this.body.removeEventListener('dragover', this.handleDragOver);
    this.body.removeEventListener('dragleave', this.handleDragLeave);
  }

  calculateFullPrice = (ticketType, bahncard, price) => {
    if (ticketType.includes("Flexpreis") && parseInt(bahncard) >= 25) {
      return Math.round(parseFloat(price) / (1 - parseInt(bahncard) / 100));
    } else if (!ticketType.includes("Flexpreis") && parseInt(bahncard) >= 25) {
      return Math.round(parseFloat(price) / 0.75);
    } else {
      return parseFloat(price);
    }
  }

  submit = async (ev) => {
    if(ev && ev.preventDefault) {
      ev.preventDefault()
    };
    if (this.state.files) {
      for (let file of this.state.files) {
        // Empty errors
        this.setState({  invalidFiles: [] });

        // Check if the file is a PDF
        if (!file.name.endsWith(".pdf")) {
          this.setState(state => {
            return { invalidFiles: [...state.invalidFiles, file.name] };
          });
          continue;
        }

        try {
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
              var outwardJourney = outwardJourneyMatch ? outwardJourneyMatch[1] || outwardJourneyMatch[2]|| outwardJourneyMatch[3] : "";
              var returnJourney = returnJourneyMatch ? returnJourneyMatch[1] || returnJourneyMatch[2]: "";
              var price = priceMatch ? parseFloat(priceMatch[2]) : 0;
              var ticketClass = ticketClassMatch ? parseInt(ticketClassMatch[1]) || parseInt(ticketClassMatch[2]) : 2;
              var travelersCount = priceMatch ? parseInt(priceMatch[1]) : 1;
              var journeyDate = journeyDateMatch ? new Date(journeyDateMatch[1].split(".").reverse().join("-")) : "";
              var ticketType = ticketTypeMatch ? ticketTypeMatch[1] || ticketTypeMatch[2] || ticketTypeMatch[3] : "";
              var bahncard = bahncardMatch ? parseInt(bahncardMatch[1]) : 0;
              console.log(journeyDate)
              // Clean data
              outwardJourney = outwardJourney.replace(/\+City/g, '').replace(" -> ", ' ').replace(/\s/g, ' - ')
              returnJourney = returnJourney != "" ? returnJourney.replace(/\+City/g, '').replace(" -> ", ' ').replace(/\s/g, ' - ') : "";
              ticketType = ticketType.replace(" (Einfache Fahrt)", '').replace(" (Hin- und Rückfahrt)", '').replace(/ \d.*/g, '')
              var journey = returnJourney == "" ? outwardJourney : outwardJourney + ", " + returnJourney

              // Check if outwardJourney and journeyDate are empty
              if (outwardJourney === "" || journeyDate === "") {
                this.setState(state => {
                  return { invalidFiles: [...state.invalidFiles, file.name] };
                });
                return;
              }

              // Calculate full undiscounted price
              var fullPrice = this.calculateFullPrice(ticketType, bahncard, price);

              // Create new ticket class
              var newTicket = new Ticket(
                outwardJourney, returnJourney, journey, price, fullPrice, ticketClass, travelersCount, journeyDate, ticketType, bahncard, ticketText);

              this.setState(state => {
                // Sort the tickets by journeyDate
                var tickets = [...state.tickets, newTicket].sort((a, b) => new Date(a.journeyDate) - new Date(b.journeyDate));
                return { tickets: tickets, files: '' };
              });
            }, false);
          } catch {
            this.setState(state => {
              return { invalidFiles: [...state.invalidFiles, file.name] };
            });
          }
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

  handleCopy = (index) => {
    this.setState(state => {
      const newTicket = { ...state.tickets[index] };
      state.tickets.push(newTicket);
      return { tickets: state.tickets };
    });
  }

  handleDrop = (event) => {
    event.preventDefault();
    if(event.dataTransfer && event.dataTransfer.files.length) {
        const files = event.dataTransfer.files;
        this.setState({ files }, () => this.submit());
    } else {
        console.log("No files found!");
    }
    this.body.classList.remove("drag-over");
  }

  handleDragOver(e) {
    e.preventDefault();
    this.body.classList.add("drag-over");
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.body.classList.remove("drag-over");
  }

  handleCloseInvalidFileNote = () => {
    this.setState({ invalidFiles: [] });
  }

  handleCellBlur = (e, index, key) => {
    let updatedTicket;
    if (this.state.tickets[index]) {
      updatedTicket = {...this.state.tickets[index]};
    } else {
      updatedTicket = {...this.state.tempTicket};
    }
    let value;
    if(key === 'journeyDate') {
        if(e.target.tagName === 'INPUT') {
            value = e.target.value;
        }
        else if(e.target.tagName === 'P') {
            value = e.target.innerText;
        }
        let date = moment(value, "YYYY-MM-DD");
        console.log(value)
        if(date.isValid()) {
            updatedTicket[key] = date.format('YYYY-MM-DD');
        } else {
            console.log("Invalid date");
            return;
        }
    } else {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            value = e.target.value;
            
        } else {
            value = e.target.innerText;
        }
        updatedTicket[key] = value;
    }
    if (this.state.tickets[index]) {
      this.setState(state => {
        let updatedTickets = state.tickets;
        updatedTickets[index] = updatedTicket;
        return { tickets: updatedTickets };
      }, () => {
        console.log("State updated successfully:", this.state.tickets);
      });
    } else {
      this.setState({ tempTicket: updatedTicket }, () => {
        console.log("State updated successfully");
      });
    }    
  }


  handleManualAdd = (index) => {
    let updatedTicket = {...this.state.tempTicket};

    // Check values and otherwise set defaults
    updatedTicket.price = parseFloat(updatedTicket.price) || 0; 
    updatedTicket.ticketType = updatedTicket.ticketType || "Flexpreis";
    updatedTicket.bahncard = updatedTicket.bahncard || 0;
    updatedTicket.travelersCount = updatedTicket.travelersCount || 1;
    updatedTicket.ticketClass = updatedTicket.ticketClass || 2;

    // Set full undicsounted price
    updatedTicket.fullPrice = this.calculateFullPrice(updatedTicket.ticketType, updatedTicket.bahncard, updatedTicket.price);

    // Update ticket list
    this.setState(state => {
      let updatedTickets = state.tickets;
      updatedTickets[index - 1] = updatedTicket;
      console.log(updatedTickets)
      return { tickets: updatedTickets, updatedTicket: {} };
    });
  };

  render() {
    return (
      <div>
        {this.state.invalidFiles.length > 0 && <InvalidFileNote files={this.state.invalidFiles} handleCloseInvalidFileNote={this.handleCloseInvalidFileNote} />}
        <TicketTable 
        tickets={this.state.tickets} 
        handleDelete={this.handleDelete} 
        handleCellBlur={this.handleCellBlur} 
        handleManualAdd={this.handleManualAdd}
        handleCopy={this.handleCopy}
        />        
        <form onSubmit={this.submit} className="fileForm">
          <p>< FaFilePdf />  Ticket-PDFs auswählen oder per Drag and Drop hier ablegen.</p>
          <input onChange={this.handleChange} type="file" id="tickets" multiple/>&nbsp;
          <input type="submit" value="Hinzufügen" />
        </form>
        <TicketSummary tickets={this.state.tickets.sort((a, b) => new Date(a.journeyDate) - new Date(b.journeyDate))} />
      </div>);
  }

};
