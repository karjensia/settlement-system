package com.settlement.dto;

import lombok.Data;
import java.util.List;

@Data
public class SettlementRequest {
    private String title;
    private String password;
    private Integer totalParticipants; // 총 인원수
    private List<ItemRequest> items;
}
