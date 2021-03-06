const flightController = {};

const flightModel = require('../lib/models/flight');

flightController.getFlights = async(req, res) => {
    try {
        const flights = await flightModel.find();
        res.json({ flights });
    } catch (error) {
        res.json({ message: error });
    }
}

flightController.getFlight = async(req, res) => {
    const { id } = req.params;
    try {
        const flight = await flightModel.findOne({ _id: id });
        res.json({ flight });
    } catch (error) {
        res.json({ message: error });
    }
}

flightController.createFlight = async(req, res) => {
    const { origin, originFlag, destination, destinationFlag, capacity, date } = req.body;
    const newFlight = new flightModel({ origin, originFlag, destination, destinationFlag, capacity, date, occupiedSeats: 0, isFull: false });
    try {
        await newFlight.save();
        res.json({ flight: newFlight });
    } catch (error) {
        res.json({ message: error });
    }
}

flightController.updateFlight = async(req, res) => {
    const { id } = req.params;
    const flight = await flightModel.findOne({ _id: id });
    const newData = {
        origin: req.body.origin || flight.origin,
        originFlag: req.body.originFlag || flight.originFlag,
        destination: req.body.destination || flight.destination,
        destinationFlag: req.body.destinationFlag || flight.destinationFlag,
        capacity: req.body.capacity || flight.capacity,
        date: req.body.date || flight.date,
        occupiedSeats: req.body.occupiedSeats || flight.occupiedSeats,
        isFull: flight.capacity === req.body.occupiedSeats ? true : false
    }

    try {
        await flightModel.findByIdAndUpdate(id, { $set: newData });
        res.json({ flight: newData });
    } catch (error) {
        res.json({ message: error });
    }
}

flightController.updateFlightTickets = async(flightId, ticketId) => {
    const flight = await flightModel.findOne({ _id: flightId });
    flight.tickets.push(ticketId);
    try {
        await flightModel.findByIdAndUpdate(flightId, { $set: flight });
    } catch (error) {

    }
}

flightController.deleteFlight = async(req, res) => {
    try {
        await flightModel.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id });
    } catch (error) {
        res.json({ message: error });
    }
}

module.exports = flightController;