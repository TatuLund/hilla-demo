package com.example.application.data.generator;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.example.application.data.entity.Company;
import com.example.application.data.entity.Contact;
import com.example.application.data.entity.Status;
import com.example.application.data.repository.CompanyRepository;
import com.example.application.data.repository.ContactRepository;
import com.example.application.data.repository.StatusRepository;
import com.vaadin.flow.spring.annotation.SpringComponent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.vaadin.exampledata.DataType;
import com.vaadin.exampledata.ExampleDataGenerator;

@SpringComponent
public class DataGenerator {

    @Bean
    public CommandLineRunner loadData(ContactRepository contactRepository, CompanyRepository companyRepository,
            StatusRepository statusRepository) {

        return args -> {
            Logger logger = LoggerFactory.getLogger(getClass());
            if (contactRepository.count() != 0L) {
                logger.info("Using existing database");
                return;
            }
            int seed = 123;

            logger.info("Generating demo data");
            var companyGenerator = new ExampleDataGenerator<>(Company.class, LocalDateTime.now());
            companyGenerator.setData(Company::setName, DataType.COMPANY_NAME);
            var companies = companyRepository.saveAll(companyGenerator.create(15, seed));

            var statuses = statusRepository
                    .saveAll(Stream.of("status-imported", "status-notcontacted", "status-contacted", "status-customer", "status-closed")
                            .map(Status::new).collect(Collectors.toList()));

            logger.info("... generating 12345 Contact entities...");
            var contactGenerator = new ExampleDataGenerator<>(Contact.class, LocalDateTime.now());
            contactGenerator.setData(Contact::setFirstName, DataType.FIRST_NAME);
            contactGenerator.setData(Contact::setLastName, DataType.LAST_NAME);
            contactGenerator.setData(Contact::setEmail, DataType.EMAIL);
            contactGenerator.setData(Contact::setDate, DataType.DATE_LAST_1_YEAR);
            contactGenerator.setData(Contact::setProspectValue, DataType.PRICE);

            Random r = new Random(seed);
            var contacts = contactGenerator.create(12345, seed).stream().map(contact -> {
                contact.setCompany(companies.get(r.nextInt(companies.size())));
                contact.setStatus(statuses.get(r.nextInt(statuses.size())));
                return contact;
            }).collect(Collectors.toList());

            contacts.forEach(contact -> {
                var date = contact.getDate();
                var newDate = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                contact.setDate(newDate);
            });

            contactRepository.saveAll(contacts);

            logger.info("Generated demo data");
        };
    }

}
