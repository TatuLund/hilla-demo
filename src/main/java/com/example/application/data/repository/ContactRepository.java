package com.example.application.data.repository;

import com.example.application.data.entity.Company;
import com.example.application.data.entity.Contact;
import com.example.application.data.entity.Status;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Integer> {

    public Page<Contact> findAllByEmailContainsIgnoreCase(String email, Pageable pageable);

    public Page<Contact> findAllByStatus(Status status, Pageable pageable);

    public Page<Contact> findAllByCompany(Company company, Pageable pageable);

    public Page<Contact> findAllByCompanyAndStatus(Company company, Status status, Pageable pageable);

    public int countByCompany(Company company);

    public int countByStatus(Status status);
}
