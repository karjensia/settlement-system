package com.settlement.dto;

import lombok.Data;

@Data
public class ItemResponse {
    private Long id;
    private String category;
    private Integer amount;
}
