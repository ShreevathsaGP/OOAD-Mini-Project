package com.ooad.miniproject.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ooad.miniproject.models.Ticket;
import com.ooad.miniproject.repositories.TicketRepository;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;

    public TicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateTicketStatus(@PathVariable String id, @RequestParam String status) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) {
            return ResponseEntity.badRequest().body("Ticket not found");
        }

        ticket.setStatus(status);
        Ticket updatedTicket = ticketRepository.save(ticket);
        return ResponseEntity.ok(updatedTicket);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return ResponseEntity.ok("Ticket deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Ticket not found");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable String id) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) {
            return ResponseEntity.badRequest().body("Ticket not found");
        }
        return ResponseEntity.ok(ticket);
    }
}
