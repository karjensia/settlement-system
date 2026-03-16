package com.settlement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantCalculation {
    private Map<String, Double> categoryAmounts; // 카테고리별 개인 부담금
    private Double totalAmount; // 총 부담금
}
