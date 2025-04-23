package com.ooad.miniproject.controllers;

import com.ooad.miniproject.models.Booking;
import com.ooad.miniproject.models.Ticket;
import com.ooad.miniproject.models.Train;
import com.ooad.miniproject.repositories.BookingRepository;
import com.ooad.miniproject.repositories.TicketRepository;
import com.ooad.miniproject.repositories.TrainRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final TrainRepository trainRepository;

    public BookingController(BookingRepository bookingRepository, TicketRepository ticketRepository, TrainRepository trainRepository) {
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.trainRepository = trainRepository;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest bookingRequest) {
        // Validate input
        if (bookingRequest.getUserId() == null || bookingRequest.getTrainId() == null || bookingRequest.getSeatRequest() == null || bookingRequest.getSeatRequest().isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid input: userId, trainId, and seatRequest are required");
        }

        // Fetch train details
        Train train = trainRepository.findById(bookingRequest.getTrainId()).orElse(null);
        if (train == null) {
            return ResponseEntity.badRequest().body("Train not found");
        }

        List<String> ticketIds = new ArrayList<>();
        double totalAmount = 0.0;

        // Get mutable copy of seats map
        Map<String, Train.SeatClass> updatedSeats = train.getSeats();

        // Process seat requests
        for (Map.Entry<String, Integer> entry : bookingRequest.getSeatRequest().entrySet()) {
            String seatClass = entry.getKey();
            int noOfTickets = entry.getValue();

            Train.SeatClass seatClassData = updatedSeats.get(seatClass);
            if (seatClassData == null) {
                return ResponseEntity.badRequest().body("Invalid seat class: " + seatClass);
            }

            // Check seat availability
            int availableSeats = seatClassData.getAvailableSeats();
            if (availableSeats < noOfTickets) {
                return ResponseEntity.badRequest().body("Not enough seats available in class: " + seatClass);
            }

            try {
                // Book seats and create tickets
                for (int i = 0; i < seatClassData.getTotalSeats() && noOfTickets > 0; i++) {
                    if (seatClassData.isSeatAvailable(i + 1)) {
                        seatClassData.bookSeat(i + 1); // Use bookSeat directly
                        
                        Ticket ticket = new Ticket(bookingRequest.getUserId(), bookingRequest.getTrainId(), 
                            "Passenger", seatClass, i + 1, "CONFIRMED", seatClassData.getPrice());
                        Ticket savedTicket = ticketRepository.save(ticket);
                        ticketIds.add(savedTicket.getId());
                        totalAmount += savedTicket.getPrice();
                        noOfTickets--;
                    }
                }
                
                // Update train with modified seats
                train.setSeats(updatedSeats);

                // Print the actual seat boolean list for each class
                // for (Map.Entry<String, Train.SeatClass> seatEntry : updatedSeats.entrySet()) {
                //     String seatClassName = seatEntry.getKey();
                //     Train.SeatClass seatClassDetails = seatEntry.getValue();
                //     System.out.println("Seat Class: " + seatClassName);
                //     System.out.println("Available Seats: " + Arrays.toString(seatClassDetails.getAvailableSeatsArray()));
                // }

                train = trainRepository.save(train);
                
            } catch (Exception e) {
                // Rollback in case of failure
                throw new RuntimeException("Failed to book tickets: " + e.getMessage());
            }
        }

        // Create booking
        Booking booking = new Booking(bookingRequest.getUserId(), ticketIds, totalAmount);
        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            return ResponseEntity.badRequest().body("Booking not found");
        }

        // Get all tickets to find seat information
        List<Ticket> tickets = ticketRepository.findByIdIn(booking.getTicketIds());
        
        // Get the train and update seat availability
        String trainId = tickets.get(0).getTrainId(); // All tickets are for the same train
        Train train = trainRepository.findById(trainId).orElse(null);
        
        if (train != null) {
            // Free up seats
            Map<String, Train.SeatClass> updatedSeats = train.getSeats();
            for (Ticket ticket : tickets) {
                Train.SeatClass seatClass = updatedSeats.get(ticket.getSeatClass());
                if (seatClass != null) {
                    seatClass.freeSeat(ticket.getSeatNumber()); // Use freeSeat directly
                }
            }
            // Save updated train with modified seats
            train.setSeats(updatedSeats);
            trainRepository.save(train);
        }

        // Delete tickets and booking
        ticketRepository.deleteAll(tickets);
        bookingRepository.deleteById(id);
        
        return ResponseEntity.ok("Booking and associated tickets deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            return ResponseEntity.badRequest().body("Booking not found");
        }
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUserId(@PathVariable String userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        if (bookings.isEmpty()) {
            return ResponseEntity.badRequest().body("No bookings found for the user");
        }
        return ResponseEntity.ok(bookings);
    }

    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return ResponseEntity.ok(bookings);
    }
}

// DTO for Booking Request
class BookingRequest {
    private String userId;
    private String trainId;
    private Map<String, Integer> seatRequest;

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTrainId() {
        return trainId;
    }

    public void setTrainId(String trainId) {
        this.trainId = trainId;
    }

    public Map<String, Integer> getSeatRequest() {
        return seatRequest;
    }

    public void setSeatRequest(Map<String, Integer> seatRequest) {
        this.seatRequest = seatRequest;
    }
}
