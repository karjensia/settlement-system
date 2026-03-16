package com.settlement.dto;

import lombok.Data;
import java.util.Set;

@Data
public class ParticipantRequest {
    private String name;
    private Set<String> participatedCategories;
}
