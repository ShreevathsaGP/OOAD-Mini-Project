package com.ooad.miniproject.repositories;

import com.ooad.miniproject.models.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    /**
     * Finds tickets by their IDs (batch lookup)
     * @param ticketIds List of ticket IDs
     * @return List of matching tickets
     */
    List<Ticket> findByIdIn(List<String> ticketIds);

    /**
     * Finds tickets by train ID and status
     * @param trainId Train ID to filter by
     * @param status Status to filter by (e.g., "CONFIRMED")
     * @return List of matching tickets
     */
    List<Ticket> findByTrainIdAndStatus(String trainId, String status);

    /**
     * Custom query using MongoDB JSON syntax
     * @param minPrice Minimum ticket price
     * @return List of premium tickets
     */
    @Query("{ 'price': { $gt: ?0 } }")
    List<Ticket> findPremiumTickets(double minPrice);
}