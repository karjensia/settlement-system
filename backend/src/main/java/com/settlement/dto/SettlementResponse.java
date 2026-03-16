package com.settlement.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class SettlementResponse {
    private Long id;
    private String uuid;
    private String title;
    private Integer totalParticipants; // 총 인원수
    private Boolean finalized;
    private LocalDateTime createdAt;
    private List<ItemResponse> items;
    private List<ParticipantResponse> participants;
    private Map<String, ParticipantCalculation> calculations;
}
