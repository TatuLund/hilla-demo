package com.example.application.data.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;

import com.example.application.data.AbstractEntity;
import dev.hilla.Nonnull;

@Entity
public class Company extends AbstractEntity {
    @NotBlank
    @Nonnull
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
