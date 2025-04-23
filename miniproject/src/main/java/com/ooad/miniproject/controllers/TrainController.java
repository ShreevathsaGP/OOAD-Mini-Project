package com.ooad.miniproject.controllers;

import com.ooad.miniproject.models.Train;
import com.ooad.miniproject.repositories.TrainRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
public class TrainController {

    private final TrainRepository trainRepository;

    public TrainController(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addTrain(@RequestBody Train train) {
        if (train.getNumber() == null || train.getName() == null || train.getStations() == null || train.getSchedule() == null) {
            return ResponseEntity.badRequest().body("Invalid input: All fields are required");
        }
        Train savedTrain = trainRepository.save(train);
        return ResponseEntity.ok(savedTrain);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTrain(@PathVariable String id) {
        if (trainRepository.existsById(id)) {
            trainRepository.deleteById(id);
            return ResponseEntity.ok("Train deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Train not found");
        }
    }

    @GetMapping
    public ResponseEntity<List<Train>> getAllTrains() {
        List<Train> trains = trainRepository.findAll();
        return ResponseEntity.ok(trains);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTrainById(@PathVariable String id) {
        var train = trainRepository.findById(id);
        if (train.isPresent()) {
            return ResponseEntity.ok(train.get());
        } else {
            return ResponseEntity.badRequest().body("Train not found");
        }
    }

    @GetMapping("/{id}/name")
    public ResponseEntity<?> getTrainNameById(@PathVariable String id) {
        var train = trainRepository.findById(id);
        if (train.isPresent()) {
            return ResponseEntity.ok(train.get().getName());
        } else {
            return ResponseEntity.badRequest().body("Train not found");
        }
    }

    @GetMapping("/{id}/number")
    public ResponseEntity<?> getTrainNumberById(@PathVariable String id) {
        var train = trainRepository.findById(id);
        if (train.isPresent()) {
            return ResponseEntity.ok(train.get().getNumber());
        } else {
            return ResponseEntity.badRequest().body("Train not found");
        }
    }
}
