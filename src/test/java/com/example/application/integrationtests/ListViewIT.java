package com.example.application.integrationtests;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NotFoundException;

import com.vaadin.flow.component.button.testbench.ButtonElement;
import com.vaadin.flow.component.combobox.testbench.ComboBoxElement;
import com.vaadin.flow.component.confirmdialog.testbench.ConfirmDialogElement;
import com.vaadin.flow.component.datepicker.testbench.DatePickerElement;
import com.vaadin.flow.component.grid.testbench.GridElement;
import com.vaadin.flow.component.notification.testbench.NotificationElement;
import com.vaadin.flow.component.select.testbench.SelectElement;
import com.vaadin.flow.component.textfield.testbench.TextFieldElement;
import com.vaadin.testbench.TestBenchElement;

public class ListViewIT extends AbstractViewTest {

    LocalDate sunday = LocalDate.of(2022,10,9);
    LocalDate thursday = LocalDate.of(2022,10,13);
    LocalDate future;

    @Override
    public void setup() throws Exception {
        super.setup();
        // Hide dev mode gizmo, it would interfere screenshot tests
        try {
            $("vaadin-dev-tools").first().setProperty("hidden", true);
        } catch (NotFoundException e) {
            
        }

        var date = LocalDate.now();
        future = date.with(TemporalAdjusters.next(DayOfWeek.MONDAY));

        login("admin","admin");
    }
    
    @Test
    public void testAddingContactWorks() {
        // After login it takes while to render, wait for target element
        waitForElementPresent(By.id("addbutton"));

        // First add a new entry
        doAddContact();

        // Search the new entry
        $(TextFieldElement.class).id("email").setValue("tatu.lund@acme.org");
        // Wait for server to respond
        wait(100);
        var grid = $(GridElement.class).first();
        assertEquals(1,grid.getRowCount());

        // Verify grid shows correct entry
        assertEquals("Tatu",grid.getCell(0,0).getText());
        assertEquals("Lund",grid.getCell(0,1).getText());
        assertEquals("tatu.lund@acme.org",grid.getCell(0,2).getText());
        assertEquals("Avaya Inc.",grid.getCell(0,4).getText());

        // click on item in grid to open it in contact form
        grid.select(0);

        // Verify that form input is still correct
        verifyForm();

        // Click to delete
        var deleteButton = $(ButtonElement.class).id("delete");
        assertEquals(null,deleteButton.getAttribute("disabled"));
        deleteButton.click();

        // Wait for dialog to open
        waitForElementPresent(By.tagName("vaadin-confirm-dialog-overlay"));
        var dialog = $(ConfirmDialogElement.class).first();
        // Click to confirm
        dialog.getConfirmButton().click();

        // Wait for notification and verify it has correct message
        waitForElementPresent(By.tagName("vaadin-notification"));
        var notification = $(NotificationElement.class).first();
        assertEquals("Contact deleted.", notification.getText());

        assertEquals(0,grid.getRowCount());
    }

    private void verifyForm() {
        // Verify that entry is having correct values
        waitForElementPresent(By.tagName("contact-form"));
        assertEquals("Tatu",$(TextFieldElement.class).id("firstname").getValue());
        assertEquals("Lund",$(TextFieldElement.class).id("lastname").getValue());
        assertEquals("tatu.lund@acme.org",$(TextFieldElement.class).id("emailfield").getValue());
        assertEquals("Avaya Inc.",$(ComboBoxElement.class).id("company").getInputElementValue());
        assertEquals("10-13-2022",$(DatePickerElement.class).id("datepicker").getInputValue());
        var prospectValue = $(TestBenchElement.class).id("prospectvalue");
        var textField = prospectValue.$(TextFieldElement.class).first();
        assertEquals("1.233,21 €",textField.getValue());
    }

    private void doAddContact() {
        // Click to add
        $(ButtonElement.class).id("addbutton").click();
 
        // Fill the fields, and test validators
        var firstName = $(TextFieldElement.class).id("firstname");
        firstName.setValue("");
        assertEquals("input is required",firstName.getProperty("errorMessage"));
        firstName.setValue("Tatu");

        $(TextFieldElement.class).id("lastname").setValue("Lund");

        var emailField = $(TextFieldElement.class).id("emailfield");
        emailField.setValue("tatu.lund");
        assertEquals("input is not valid e-mail address",emailField.getProperty("errorMessage"));
        $(TextFieldElement.class).id("emailfield").setValue("tatu.lund@acme.org");

        var comboBox = $(ComboBoxElement.class).id("company");
        comboBox.focus();
        assertNotEquals("true",emailField.getAttribute("invalid"));
        comboBox.sendKeys(comboBox.getOptions().get(1));
        blur();

        var dateField = $(DatePickerElement.class).id("datepicker");
        dateField.focus();
        assertNotEquals("true",comboBox.getAttribute("invalid"));
        dateField.setDate(sunday);
        blur();
        assertEquals("date is required, date can't be in future, date must be weekday",dateField.getProperty("errorMessage"));
        dateField.focus();
        dateField.setDate(thursday);
        blur();
        dateField.focus();
        assertNotEquals("true",dateField.getAttribute("invalid"));
        dateField.setDate(future);
        blur();
        assertEquals("date is required, date can't be in future, date must be weekday",dateField.getProperty("errorMessage"));
        dateField.focus();
        dateField.setDate(thursday);

        $(SelectElement.class).id("status").getItems().get(1).click();

        var prospectValue = $(TestBenchElement.class).id("prospectvalue");
        prospectValue.focus();
        assertNotEquals("true",dateField.getAttribute("invalid"));
        var textField = prospectValue.$(TextFieldElement.class).first();
        textField.sendKeys("1233,21");

        var saveButton = $(ButtonElement.class).id("save");
        saveButton.focus();
        assertEquals("1.233,21 €",textField.getValue());

        // Click to save
        assertEquals(null,saveButton.getAttribute("disabled"));
        saveButton.click();

        // Wait for notification and verify it has correct message
        waitForElementPresent(By.tagName("vaadin-notification"));
        var notification = $(NotificationElement.class).first();
        assertEquals("Contact saved.", notification.getText());
    }
}
