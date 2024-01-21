import React from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import TicketTable from './TicketTable';
import Ticket from './entities/Ticket';
import ticketTypes from './data/ticketTypes';
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
    let maxDiscount = ticketTypes[ticketType] || 1;
    let fullPrice = 0;
    let discount = 0;
    if (parseInt(bahncard)/100 < maxDiscount){
      discount = parseInt(bahncard)/100;
    } else {
      discount = maxDiscount;
    }
    
    fullPrice = (parseFloat(price) / (1 - discount));
    return parseFloat(fullPrice.toFixed(2));
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
            try {
              var pdfData = await pdfjsLib.getDocument({ data: new Uint8Array(reader.result) }).promise;
              var page = await pdfData.getPage(1);
              var textContent = await page.getTextContent();
              var ticketText = textContent.items.map(item => item.str).join(" ").replace(/\s+/g, ' ');
              console.log(ticketText);

              // Match ticket data
              var outwardJourneyMatch = ticketText.match(regex.outwardJourneyRegex);
              var returnJourneyMatch = ticketText.match(regex.returnJourneyRegex);
              var priceMatch = ticketText.match(regex.priceRegex);
              var numTravelersMatch = ticketText.match(regex.numTravelers);
              var ticketClassMatch = ticketText.match(regex.ticketClassRegex);
              var journeyDateMatch = ticketText.match(regex.journeyDateRegex);
              var ticketTypeMatch = ticketText.match(regex.ticketTypeRegex);
              var bahncardMatch = ticketText.match(regex.bahncardRegex);

              // Extract ticket data
              var outwardJourney = outwardJourneyMatch ? outwardJourneyMatch[1] || outwardJourneyMatch [2]|| outwardJourneyMatch[3] || outwardJourneyMatch[4]: "";
              var returnJourney = returnJourneyMatch ? returnJourneyMatch[1] || returnJourneyMatch[2] || returnJourneyMatch[3] || returnJourneyMatch[4]: "";
              var price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
              var ticketClass = ticketClassMatch ? parseInt(ticketClassMatch[1]) || parseInt(ticketClassMatch[2]) : 2;
              var travelersCount = numTravelersMatch ? parseInt(numTravelersMatch[1]) || parseInt(numTravelersMatch[2]) : 1;
              var journeyDate = journeyDateMatch ? new Date(journeyDateMatch[1].split(".").reverse().join("-")) : "";
              var ticketTypeString = ticketTypeMatch ? ticketTypeMatch[1] || ticketTypeMatch[2] || ticketTypeMatch[3] || ticketTypeMatch[4] : "";
              var ticketCategoryMatch = ticketTypeString != null ? ticketTypeString.match(regex.ticketCategoryRegex) : null;
              var ticketCategory = ticketCategoryMatch != null ? ticketCategoryMatch[1].replace("SuperSparpreis", 'Super Sparpreis') : "Andere";
              var bahncard = bahncardMatch ? parseInt(bahncardMatch[1]) : 0;

              // Clean data
              outwardJourney = outwardJourney.replace(/\+City/g, '').replace(" -> ", ' ').replace(/\s(?!Hbf)/g, ' - ')
              returnJourney = returnJourney != "" ? returnJourney.replace(/\+City/g, '').replace(" -> ", ' ').replace(/\s/g, ' - ') : "";
              // Old
              // ticketType = ticketType.replace(" (Einfache Fahrt)", '').replace(" (Hin- und Rückfahrt)", '').replace(" Young", '').replace("SuperSparpreis", 'Super Sparpreis').replace(" Europa", '').replace(" EU", '').replace(" Plus", '').replace(/ \d.*/g, '')
              var ticketType = Object.keys(ticketTypes).find(key => key === ticketCategory) || 'Andere';
              var journey = returnJourney == "" ? outwardJourney : outwardJourney + ", " + returnJourney

              // Check if outwardJourney and journeyDate are empty
              if (ticketType === "" || price === "" || journeyDate === "") {
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
              
              console.log(newTicket)

              this.setState(state => {
                // Sort the tickets by journeyDate
                var tickets = [...state.tickets, newTicket].sort((a, b) => new Date(a.journeyDate) - new Date(b.journeyDate));
                return { tickets: tickets, files: '' };
              });
            } catch(error) {
              console.error(error)
              this.setState(state => {
                return { invalidFiles: [...state.invalidFiles, file.name] };
              });
            }

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
        if(date.isValid()) {
            updatedTicket[key] = date.format('YYYY-MM-DD');
        } else {
            console.log("Invalid date");
            return;
        }
    } else {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            value = e.target.value;
        } else {
            value = e.target.innerText;
        }
        if(key === 'price') {
            value = parseFloat(value)
        }
        updatedTicket[key] = value;
        updatedTicket["fullPrice"] = this.calculateFullPrice(updatedTicket["ticketType"], updatedTicket["bahncard"], updatedTicket["price"]);
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

  updateTicketField = (index, key, value) => {
    this.setState(state => {
      let updatedTickets = [...state.tickets];
      let updatedTicket = { ...updatedTickets[index], [key]: value };
  
      if (key === 'price' || key === 'ticketType' || key === 'bahncard') {
        updatedTicket.fullPrice = this.calculateFullPrice(updatedTicket.ticketType, updatedTicket.bahncard, updatedTicket.price);
      }
  
      updatedTickets[index] = updatedTicket;
      return { tickets: updatedTickets };
    });
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
        updateTicketField={this.updateTicketField}
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
