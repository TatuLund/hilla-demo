package com.example.application.data.entity;

import jakarta.persistence.Entity;

import com.example.application.data.AbstractEntity;
import dev.hilla.Nonnull;

@Entity
public class Status extends AbstractEntity {
    @Nonnull
    private String name;

    public Status() {

    }

    public Status(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
