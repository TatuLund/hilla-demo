package com.example.application.data.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.application.data.entity.Company;
import com.example.application.data.entity.Contact;
import com.example.application.data.entity.Status;
import com.example.application.data.repository.CompanyRepository;
import com.example.application.data.repository.ContactRepository;
import com.example.application.data.repository.StatusRepository;

@Service
public class CrmService {

    private ContactRepository contactRepository;
    private CompanyRepository companyRepository;
    private StatusRepository statusRepository;

    public CrmService(ContactRepository contactRepository, CompanyRepository companyRepository,
            StatusRepository statusRepository) {
        this.contactRepository = contactRepository;
        this.companyRepository = companyRepository;
        this.statusRepository = statusRepository;
    }

    public Page<Contact> getPage(int page, int pageSize, String filter) {
        var dbPage = contactRepository.findAllByEmailContainsIgnoreCase(filter, PageRequest.of(page, pageSize));
        return dbPage;
    }

    public Page<Contact> getPageByCompanyAndStatus(int page, int pageSize, String companyName, String statusName) {
        Company company = companyRepository.findByName(companyName);
        Status status = statusRepository.findByName(statusName);
        var dbPage = contactRepository.findAllByCompanyAndStatus(company, status, PageRequest.of(page, pageSize));
        return dbPage;
    }

    public Page<Contact> getPageByCompany(int page, int pageSize, String companyName) {
        Company company = companyRepository.findByName(companyName);
        var dbPage = contactRepository.findAllByCompany(company,  PageRequest.of(page, pageSize));
        return dbPage;
    }

    public Page<Contact> getPageByStatus(int page, int pageSize, String statusName) {
        Status status = statusRepository.findByName(statusName);
        var dbPage = contactRepository.findAllByStatus(status,  PageRequest.of(page, pageSize));
        return dbPage;
    }

    public long getCount() { 
        return contactRepository.count();
    }

    public Map<String, Integer> getCompanyCounts() {
        Map<String, Integer> companyCounts = new HashMap<>();
        var companies = companyRepository.findAll();
        companies.forEach(company -> {
            companyCounts.put(company.getName(), contactRepository.countByCompany(company));
        });
        return companyCounts;
    }

    public Map<String, Integer> getStatusCounts() {
        Map<String, Integer> statusCounts = new HashMap<>();
        var statuses = statusRepository.findAll();
        statuses.forEach(status -> {
            statusCounts.put(status.getName(), contactRepository.countByStatus(status));
        });
        return statusCounts;
    }

    public List<Company> getCompanies() {
        return companyRepository.findAll();
    }

    public List<Status> getStatuses() {
        return statusRepository.findAll();
    }

    public Contact saveContact(Contact contact) {
        // Only use the id of the company, we don't want to update anything else on
        // Company.
        contact.setCompany(companyRepository.findById(contact.getCompany().getId())
        .orElseThrow(() -> new RuntimeException(
            "Could not find Company with ID " + contact.getCompany().getId())));
        contact.setStatus(statusRepository.findById(contact.getStatus().getId())
        .orElseThrow(() -> new RuntimeException(
            "Could not find Status with ID " + contact.getStatus().getId())));
        return contactRepository.save(contact);
    }

    @Transactional
    public void deleteContact(Integer contactId) {
        contactRepository.deleteById(contactId);
    }
}
