package com.settlement.controller;

import com.settlement.dto.AccessRequest;
import com.settlement.dto.AddParticipantRequest;
import com.settlement.dto.SettlementRequest;
import com.settlement.dto.SettlementResponse;
import com.settlement.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SettlementController {
    
    private final SettlementService settlementService;
    
    @PostMapping
    public ResponseEntity<SettlementResponse> createSettlement(@RequestBody SettlementRequest request) {
        return ResponseEntity.ok(settlementService.createSettlement(request));
    }
    
    @GetMapping
    public ResponseEntity<List<SettlementResponse>> getAllSettlements() {
        return ResponseEntity.ok(settlementService.getAllSettlements());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SettlementResponse> getSettlement(@PathVariable Long id) {
        return ResponseEntity.ok(settlementService.getSettlement(id));
    }
    
    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<SettlementResponse> getSettlementByUuid(@PathVariable String uuid) {
        return ResponseEntity.ok(settlementService.getSettlementByUuid(uuid));
    }
    
    @PostMapping("/access")
    public ResponseEntity<SettlementResponse> accessByTitleAndPassword(@RequestBody AccessRequest request) {
        return ResponseEntity.ok(settlementService.accessByTitleAndPassword(request.getTitle(), request.getPassword()));
    }
    
    @PostMapping("/uuid/{uuid}/participants")
    public ResponseEntity<SettlementResponse> addParticipant(
            @PathVariable String uuid,
            @RequestBody AddParticipantRequest request) {
        return ResponseEntity.ok(settlementService.addParticipant(uuid, request));
    }
    
    @PostMapping("/uuid/{uuid}/finalize")
    public ResponseEntity<SettlementResponse> finalizeSettlement(
            @PathVariable String uuid,
            @RequestBody Map<String, String> payload) {
        String password = payload.get("password");
        return ResponseEntity.ok(settlementService.finalizeSettlement(uuid, password));
    }
    
    @DeleteMapping("/uuid/{uuid}")
    public ResponseEntity<Void> deleteSettlementByUuid(
            @PathVariable String uuid,
            @RequestBody Map<String, String> payload) {
        String password = payload.get("password");
        settlementService.deleteSettlementByUuid(uuid, password);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/uuid/{uuid}/participants/{participantId}")
    public ResponseEntity<SettlementResponse> removeParticipant(
            @PathVariable String uuid,
            @PathVariable Long participantId,
            @RequestBody Map<String, String> payload) {
        String password = payload.get("password");
        return ResponseEntity.ok(settlementService.removeParticipant(uuid, participantId, password));
    }
    
    @PutMapping("/uuid/{uuid}/participants/{participantId}")
    public ResponseEntity<SettlementResponse> updateParticipant(
            @PathVariable String uuid,
            @PathVariable Long participantId,
            @RequestBody Map<String, Object> payload) {
        String password = (String) payload.get("password");
        AddParticipantRequest request = new AddParticipantRequest();
        request.setName((String) payload.get("name"));
        List<String> categories = (List<String>) payload.get("participatedCategories");
        request.setParticipatedCategories(new HashSet<>(categories));
        return ResponseEntity.ok(settlementService.updateParticipant(uuid, participantId, request, password));
    }
    
    @PostMapping("/uuid/{uuid}/verify")
    public ResponseEntity<Map<String, Boolean>> verifyPassword(
            @PathVariable String uuid, 
            @RequestBody Map<String, String> payload) {
        String password = payload.get("password");
        boolean valid = settlementService.verifyPassword(uuid, password);
        return ResponseEntity.ok(Map.of("valid", valid));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSettlement(@PathVariable Long id) {
        settlementService.deleteSettlement(id);
        return ResponseEntity.noContent().build();
    }
}
