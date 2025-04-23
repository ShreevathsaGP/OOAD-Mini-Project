package com.ooad.miniproject.repositories;

import com.ooad.miniproject.models.Train;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface TrainRepository extends MongoRepository<Train, String> {

    /**
     * Finds trains between two stations
     * @param departureStation Departure station code
     * @param arrivalStation Arrival station code
     * @return List of matching trains
     */
    @Query("{ 'stations.departureStationCode': ?0, 'stations.arrivalStationCode': ?1 }")
    List<Train> findTrainsBetweenStations(String departureStation, String arrivalStation);

    /**
     * Finds trains departing after a specific time
     * @param afterDateTime Minimum departure time
     * @return List of upcoming trains
     */
    List<Train> findBySchedule_DepartureTimeAfter(LocalDateTime afterDateTime);

    /**
     * Finds trains by departure time after a specific time
     * @param departureTime Minimum departure time
     * @return List of trains departing after the specified time
     */
    @Query("{ 'schedule.departureTime': { $gte: ?0 } }")
    List<Train> findTrainsByDepartureTimeAfter(LocalDateTime departureTime);
}