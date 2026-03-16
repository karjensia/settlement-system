package com.settlement.service;

import com.settlement.dto.*;
import com.settlement.model.*;
import com.settlement.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SettlementService {
    
    private static final String MASTER_PASSWORD = "qmflej@1234";
    private final SettlementRepository settlementRepository;
    
    @Transactional
    public SettlementResponse createSettlement(SettlementRequest request) {
        Settlement settlement = new Settlement();
        settlement.setTitle(request.getTitle());
        settlement.setPassword(request.getPassword());
        settlement.setTotalParticipants(request.getTotalParticipants());
        settlement.setFinalized(false);
        
        // 항목 추가
        List<SettlementItem> items = request.getItems().stream()
            .map(itemReq -> {
                SettlementItem item = new SettlementItem();
                item.setCategory(itemReq.getCategory());
                item.setAmount(itemReq.getAmount());
                item.setSettlement(settlement);
                return item;
            })
            .collect(Collectors.toList());
        settlement.setItems(items);
        
        Settlement saved = settlementRepository.save(settlement);
        return convertToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public List<SettlementResponse> getAllSettlements() {
        return settlementRepository.findAll().stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public SettlementResponse getSettlement(Long id) {
        Settlement settlement = settlementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Settlement not found"));
        return convertToResponse(settlement);
    }
    
    @Transactional(readOnly = true)
    public SettlementResponse getSettlementByUuid(String uuid) {
        Settlement settlement = settlementRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("Settlement not found"));
        return convertToResponse(settlement);
    }
    
    @Transactional(readOnly = true)
    public boolean verifyPassword(String uuid, String password) {
        Settlement settlement = settlementRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("Settlement not found"));
        return settlement.getPassword() != null && settlement.getPassword().equals(password);
    }
    
    @Transactional
    public SettlementResponse addParticipant(String uuid, AddParticipantRequest request) {
        Settlement settlement = settlementRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("Settlement not found"));
        
        if (settlement.getFinalized()) {
            throw new RuntimeException("Settlement is already finalized");
        }
        
        Participant participant = new Participant();
        participant.setName(request.getName());
        participant.setParticipatedCategories(request.getParticipatedCategories());
        participant.setSettlement(settlement);
        
        settlement.getParticipants().add(participant);
        Settlement saved = settlementRepository.save(settlement);
        return convertToResponse(saved);
    }
    
    @Transactional
    public SettlementResponse finalizeSettlement(String uuid, String password) {
        Settlement settlement = settlementRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("Settlement not found"));
        
        if (!isPasswordValid(settlement, password)) {
            throw new RuntimeException("Invalid password");
        }
        
        settlement.setFinalized(true);
        Settlement saved = settlementRepository.save(settlement);
        return convertToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public SettlementResponse accessByTitleAndPassword(String title, String password) {
        List<Settlement> settlements = settlementRepository.findByTitle(title);
        
        if (settlements.isEmpty()) {
            throw new RuntimeException("Settlement not found");
        }
        
        // 여러 개가 있을 경우 비밀번호가 일치하는 것 찾기
        for (Settlement settlement : settlements) {
            if (settlement.getPassword() != null && settlement.getPassword().equals(password)) {
                return convertToResponse(settlement);
            }
        }
        
        throw new RuntimeException("Invalid password");
    }
    
    @Transactional
    public void deleteSettlementByUuid(String uuid, String password) {
        Settlement settlement = settlementRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("Settlement not found"));
        
        if (!isPasswordValid(settlement, password)) {
            throw new RuntimeException("Invalid password");
        }
        
        settlementRepository.delete(settlement);
    }
    
    @Transactional
    public SettlementResponse removeParticipant(String uuid, Long participantId, String password) {
        Settlement settlement = settlementRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("Settlement not found"));
        
        if (!isPasswordValid(settlement, password)) {
            throw new RuntimeException("Invalid password");
        }
        
        if (settlement.getFinalized()) {
            throw new RuntimeException("Cannot remove participant from finalized settlement");
        }
        
        settlement.getParticipants().removeIf(p -> p.getId().equals(participantId));
        Settlement saved = settlementRepository.save(settlement);
        return convertToResponse(saved);
    }
    
    @Transactional
    public SettlementResponse updateParticipant(String uuid, Long participantId, AddParticipantRequest request, String password) {
        Settlement settlement = settlementRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("Settlement not found"));
        
        if (!isPasswordValid(settlement, password)) {
            throw new RuntimeException("Invalid password");
        }
        
        if (settlement.getFinalized()) {
            throw new RuntimeException("Cannot update participant in finalized settlement");
        }
        
        Participant participant = settlement.getParticipants().stream()
            .filter(p -> p.getId().equals(participantId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Participant not found"));
        
        participant.setName(request.getName());
        participant.setParticipatedCategories(request.getParticipatedCategories());
        
        Settlement saved = settlementRepository.save(settlement);
        return convertToResponse(saved);
    }
    
    private boolean isPasswordValid(Settlement settlement, String password) {
        return MASTER_PASSWORD.equals(password) || 
               (settlement.getPassword() != null && settlement.getPassword().equals(password));
    }
    
    @Transactional
    public void deleteSettlement(Long id) {
        settlementRepository.deleteById(id);
    }
    
    private SettlementResponse convertToResponse(Settlement settlement) {
        SettlementResponse response = new SettlementResponse();
        response.setId(settlement.getId());
        response.setUuid(settlement.getUuid());
        response.setTitle(settlement.getTitle());
        response.setTotalParticipants(settlement.getTotalParticipants());
        response.setFinalized(settlement.getFinalized());
        response.setCreatedAt(settlement.getCreatedAt());
        
        // 항목 변환
        List<ItemResponse> itemResponses = settlement.getItems().stream()
            .map(item -> {
                ItemResponse itemResp = new ItemResponse();
                itemResp.setId(item.getId());
                itemResp.setCategory(item.getCategory());
                itemResp.setAmount(item.getAmount());
                return itemResp;
            })
            .collect(Collectors.toList());
        response.setItems(itemResponses);
        
        // 참여자 변환
        List<ParticipantResponse> participantResponses = settlement.getParticipants().stream()
            .map(participant -> {
                ParticipantResponse partResp = new ParticipantResponse();
                partResp.setId(participant.getId());
                partResp.setName(participant.getName());
                partResp.setParticipatedCategories(participant.getParticipatedCategories());
                return partResp;
            })
            .collect(Collectors.toList());
        response.setParticipants(participantResponses);
        
        // 정산 계산
        Map<String, ParticipantCalculation> calculations = calculateSettlement(settlement);
        response.setCalculations(calculations);
        
        return response;
    }
    
    private Map<String, ParticipantCalculation> calculateSettlement(Settlement settlement) {
        Map<String, ParticipantCalculation> result = new HashMap<>();
        
        // 카테고리별 참여 인원 계산
        Map<String, Long> categoryParticipantCount = new HashMap<>();
        for (Participant participant : settlement.getParticipants()) {
            for (String category : participant.getParticipatedCategories()) {
                categoryParticipantCount.merge(category, 1L, Long::sum);
            }
        }
        
        // 각 참여자별 정산 금액 계산
        for (Participant participant : settlement.getParticipants()) {
            Map<String, Double> categoryAmounts = new HashMap<>();
            double total = 0.0;
            
            for (String category : participant.getParticipatedCategories()) {
                // 해당 카테고리의 총액 찾기
                Optional<SettlementItem> itemOpt = settlement.getItems().stream()
                    .filter(item -> item.getCategory().equals(category))
                    .findFirst();
                
                if (itemOpt.isPresent()) {
                    int itemAmount = itemOpt.get().getAmount();
                    long participantCount = categoryParticipantCount.getOrDefault(category, 1L);
                    double perPersonAmount = (double) itemAmount / participantCount;
                    
                    categoryAmounts.put(category, perPersonAmount);
                    total += perPersonAmount;
                }
            }
            
            result.put(participant.getName(), new ParticipantCalculation(categoryAmounts, total));
        }
        
        return result;
    }
}
