package com.example.application.integrationtests;

import static org.junit.Assert.assertEquals;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NotFoundException;

import com.vaadin.flow.component.button.testbench.ButtonElement;
import com.vaadin.flow.component.combobox.testbench.ComboBoxElement;
import com.vaadin.flow.component.datepicker.testbench.DatePickerElement;
import com.vaadin.flow.component.grid.testbench.GridElement;
import com.vaadin.flow.component.notification.testbench.NotificationElement;
import com.vaadin.flow.component.select.testbench.SelectElement;
import com.vaadin.flow.component.textfield.testbench.TextFieldElement;
import com.vaadin.testbench.TestBenchElement;

public class ListViewIT extends AbstractViewTest {

    @Override
    public void setup() throws Exception {
        super.setup();
        // Hide dev mode gizmo, it would interfere screenshot tests
        try {
            $("vaadin-dev-tools").first().setProperty("hidden", true);
        } catch (NotFoundException e) {
            
        }

        login("admin","admin");
    }

    @Test
    public void testAddingContactWorksHappyPath() {
        // After login it takes while to render, wait for target element
        waitForElementPresent(By.id("addbutton"));

        // First add a new entry
        doAddContact();

        // Search the new entry, click on item in grid to open it in contact form
        $(TextFieldElement.class).id("email").setValue("tatu.lund@acme.org");
        var grid = $(GridElement.class).first();
        grid.getCell(0, 0).click();
 
        // Verify that entry is having correct values
        waitForElementPresent(By.tagName("contact-form"));
        assertEquals("Tatu",$(TextFieldElement.class).id("firstname").getValue());
        assertEquals("Lund",$(TextFieldElement.class).id("lastname").getValue());
        assertEquals("tatu.lund@acme.org",$(TextFieldElement.class).id("emailfield").getValue());
    }

    private void doAddContact() {
        // Click to add
        $(ButtonElement.class).id("addbutton").click();
 
        // Fill the fields
        $(TextFieldElement.class).id("firstname").setValue("Tatu");
        $(TextFieldElement.class).id("lastname").setValue("Lund");
        $(TextFieldElement.class).id("emailfield").setValue("tatu.lund@acme.org");
        var comboBox = $(ComboBoxElement.class).id("company");
        comboBox.focus();
        comboBox.sendKeys(comboBox.getOptions().get(1));
        blur();
        var date = LocalDate.now();
        var newDate = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        var dateField = $(DatePickerElement.class).id("datepicker");
        dateField.focus();
        dateField.setDate(newDate);
        blur();
        $(SelectElement.class).id("status").getItems().get(1).click();
        var prospectValue = $(TestBenchElement.class).id("prospectvalue");
        prospectValue.focus();
        prospectValue.$(TextFieldElement.class).first().sendKeys("1.233,21");
        blur();

        // Click to save
        var saveButton = $(ButtonElement.class).id("save");
        saveButton.click();

        // Wait for notification and verify it has correct message
        waitForElementPresent(By.tagName("vaadin-notification"));
        var notification = $(NotificationElement.class).first();
        assertEquals("Contact saved.", notification.getText());
    }
}
