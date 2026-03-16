package com.settlement.dto;

import lombok.Data;
import java.util.Set;

@Data
public class ParticipantResponse {
    private Long id;
    private String name;
    private Set<String> participatedCategories;
}
