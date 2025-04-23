package com.ooad.miniproject.repositories;

import com.ooad.miniproject.models.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    /**
     * Finds bookings by user ID
     * @param userId User ID to filter by
     * @return List of user's bookings
     */
    List<Booking> findByUserId(String userId);

    /**
     * Checks if a booking exists with given ticket IDs
     * @param ticketIds List of ticket IDs
     * @return true if any booking contains these tickets
     */
    boolean existsByTicketIdsIn(List<String> ticketIds);
}