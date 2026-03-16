package com.settlement.dto;

import lombok.Data;
import java.util.Set;

@Data
public class AddParticipantRequest {
    private String name;
    private Set<String> participatedCategories;
}
