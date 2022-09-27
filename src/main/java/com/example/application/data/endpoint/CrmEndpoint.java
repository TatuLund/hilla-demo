package com.example.application.data.endpoint;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.application.data.entity.Company;
import com.example.application.data.entity.Contact;
import com.example.application.data.entity.Status;
import com.example.application.data.repository.CompanyRepository;
import com.example.application.data.repository.ContactRepository;
import com.example.application.data.repository.StatusRepository;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

@Endpoint
@PermitAll
public class CrmEndpoint {

    private ContactRepository contactRepository;
    private CompanyRepository companyRepository;
    private StatusRepository statusRepository;

    class PageResponse {
        @Nonnull
        public List<@Nonnull Contact> content;
        @Nonnull
        public Long size;
    }

    public CrmEndpoint(ContactRepository contactRepository, CompanyRepository companyRepository,
            StatusRepository statusRepository) {
        this.contactRepository = contactRepository;
        this.companyRepository = companyRepository;
        this.statusRepository = statusRepository;
    }

    public static class CrmData {
        @Nonnull
        public List<@Nonnull Company> companies;
        @Nonnull
        public List<@Nonnull Status> statuses;
    }

    public static class ContactStats {
        @Nonnull
        public Map<@Nonnull String, @Nonnull Integer> companyCounts = new HashMap<>();;
        @Nonnull
        public Map<@Nonnull String, @Nonnull Integer> statusCounts = new HashMap<>();;
    }

    @Nonnull
    public PageResponse getPage(int page, int pageSize, String filter) {
        var dbPage = contactRepository.findAllByEmailContainsIgnoreCase(filter, PageRequest.of(page, pageSize));
        var response = new PageResponse();
        response.content = dbPage.getContent();
        response.size = dbPage.getTotalElements();

        return response;
    }

    @Nonnull
    public PageResponse getPageByCompanyAndStatus(int page, int pageSize, String companyName, String statusName) {
        Company company = companyRepository.findByName(companyName);
        Status status = statusRepository.findByName(statusName);
        var dbPage = contactRepository.findAllByCompanyAndStatus(company, status, PageRequest.of(page, pageSize));
        var response = new PageResponse();
        response.content = dbPage.getContent();
        response.size = dbPage.getTotalElements();        
        return response;
    }

    @Nonnull
    public PageResponse getPageByCompany(int page, int pageSize, String companyName) {
        Company company = companyRepository.findByName(companyName);
        var dbPage = contactRepository.findAllByCompany(company,  PageRequest.of(page, pageSize));
        var response = new PageResponse();
        response.content = dbPage.getContent();
        response.size = dbPage.getTotalElements();        
        return response;
    }
 
    @Nonnull
    public PageResponse getPageByStatus(int page, int pageSize, String statusName) {
        Status status = statusRepository.findByName(statusName);
        var dbPage = contactRepository.findAllByStatus(status,  PageRequest.of(page, pageSize));
        var response = new PageResponse();
        response.content = dbPage.getContent();
        response.size = dbPage.getTotalElements();        
        return response;
    }
    
    public long getCount() { 
        return contactRepository.count();
    }

    @Nonnull
    public ContactStats getContactStats() {
        var companyStats = new ContactStats();
        var companies = companyRepository.findAll();
        companies.forEach(company -> {
            companyStats.companyCounts.put(company.getName(), contactRepository.countByCompany(company));
        });
        var statuses = statusRepository.findAll();
        statuses.forEach(status -> {
            companyStats.statusCounts.put(status.getName(), contactRepository.countByStatus(status));
        });
        return companyStats;
    }

    @Nonnull
    public CrmData getCrmData() {
        var crmData = new CrmData();
        crmData.companies = companyRepository.findAll();
        crmData.statuses = statusRepository.findAll();
        return crmData;
    }

    // Secure endpoint method for ADMIN users only as user can re-enable buttons
    // using browser devtools, etc.
    @Nonnull
    @RolesAllowed("ADMIN")
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

    // Secure endpoint method for ADMIN users only as user can re-enable buttons
    // using browser devtools, etc.
    @RolesAllowed("ADMIN")
    public void deleteContact(Integer contactId) {
        contactRepository.deleteById(contactId);
    }

    // Alternative method for checking admin access. The difference to @RolesAllowed is that this results
    // http error code 500, while @RolesAllowed 401. 401 will kick out the user.
    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!authentication.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            throw new RuntimeException("ADMIN privileges required to delete a contact");
        }
    }
}
