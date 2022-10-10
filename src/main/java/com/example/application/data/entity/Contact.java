package com.example.application.data.entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import dev.hilla.Nonnull;
import com.example.application.data.AbstractEntity;
import com.example.application.data.validators.CustomDateConstraint;

@Entity
public class Contact extends AbstractEntity {

    @NotEmpty
    @Nonnull
    private String firstName = "";

    @NotEmpty
    @Nonnull
    private String lastName = "";

    @NotNull
    @ManyToOne
    @Nonnull
    private Company company;

    @NotNull
    @ManyToOne
    @Nonnull
    private Status status;

    @Email
    @NotEmpty
    @Nonnull
    private String email = "";

    @CustomDateConstraint
    @Nonnull
    @NotNull
    private LocalDate date;

    @Override
    public String toString() {
        return firstName + " " + lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
