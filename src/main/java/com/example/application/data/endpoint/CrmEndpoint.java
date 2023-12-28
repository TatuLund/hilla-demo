package com.example.application.data.endpoint;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.application.data.entity.Company;
import com.example.application.data.entity.Contact;
import com.example.application.data.entity.Status;
import com.example.application.data.service.CrmService;

import dev.hilla.BrowserCallable;
import dev.hilla.Nonnull;

@BrowserCallable
@PermitAll
public class CrmEndpoint {

    private CrmService crmService;

    Logger logger = LoggerFactory.getLogger(CrmEndpoint.class);

    class PageResponse {
        @Nonnull
        public List<@Nonnull Contact> content;
        @Nonnull
        public Long size;
    }

    public CrmEndpoint(CrmService crmService) {
        this.crmService = crmService;
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
        var dbPage = crmService.getPage(page, pageSize, filter);
        var response = new PageResponse();
        response.content = dbPage.getContent();
        response.size = dbPage.getTotalElements();
        logger.info("Page "+page+" fetched with "+pageSize+"/"+response.size+" items");
        return response;
    }

    @Nonnull
    public PageResponse getPageByCompanyAndStatus(int page, int pageSize, String companyName, String statusName) {
        var dbPage = crmService.getPageByCompanyAndStatus(page, pageSize, companyName, statusName);
        var response = new PageResponse();
        response.content = dbPage.getContent();
        response.size = dbPage.getTotalElements();
        logger.info("Page "+page+" by '"+companyName+"' and '"+statusName+"' fetched with "+pageSize+"/"+response.size+" items");
        return response;
    }

    @Nonnull
    public PageResponse getPageByCompany(int page, int pageSize, String companyName) {
        var dbPage = crmService.getPageByCompany(page, pageSize, companyName);
        var response = new PageResponse();
        response.content = dbPage.getContent();
        response.size = dbPage.getTotalElements();
        logger.info("Page "+page+" by '"+companyName+"' fetched with "+pageSize+"/"+response.size+" items");
        return response;
    }
 
    @Nonnull
    public PageResponse getPageByStatus(int page, int pageSize, String statusName) {
        var dbPage = crmService.getPageByStatus(page, pageSize, statusName);
        var response = new PageResponse();
        response.content = dbPage.getContent();
        response.size = dbPage.getTotalElements();
        logger.info("Page "+page+" by '"+statusName+"' fetched with "+pageSize+"/"+response.size+" items");
        return response;
    }
    
    public long getCount() { 
        return crmService.getCount();
    }

    @Nonnull
    public ContactStats getContactStats() {
        var companyStats = new ContactStats();
        companyStats.companyCounts = crmService.getCompanyCounts();
        companyStats.statusCounts = crmService.getStatusCounts();
        logger.info("Fetched company and status statistics");
        return companyStats;
    }

    @Nonnull
    public CrmData getCrmData() {
        var crmData = new CrmData();
        crmData.companies = crmService.getCompanies();
        crmData.statuses = crmService.getStatuses();
        logger.info("Fetched companies and statuses");
        return crmData;
    }

    // Secure endpoint method for ADMIN users only as user can re-enable buttons
    // using browser devtools, etc.
    @Nonnull
    @RolesAllowed("ADMIN")
    public Contact saveContact(Contact contact) {
        // Only use the id of the company, we don't want to update anything else on
        // Company.
        logger.info("Saving new contact: "+contact.getId());
        return crmService.saveContact(contact);
    }

    // Secure endpoint method for ADMIN users only as user can re-enable buttons
    // using browser devtools, etc.
    @RolesAllowed("ADMIN")
    public void deleteContact(Integer contactId) {
        logger.info("Deleting contact: "+contactId);
        crmService.deleteContact(contactId);
    }
}
