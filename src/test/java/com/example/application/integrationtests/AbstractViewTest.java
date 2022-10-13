package com.example.application.integrationtests;

import io.github.bonigarcia.wdm.WebDriverManager;

import java.util.Objects;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;

import com.vaadin.flow.component.login.testbench.LoginFormElement;
import com.vaadin.testbench.ScreenshotOnFailureRule;
import com.vaadin.testbench.TestBench;
import com.vaadin.testbench.TestBenchTestCase;

/**
 * Base class for ITs
 * <p>
 * The tests use Chrome driver (see pom.xml for integration-tests profile) to
 * run integration tests on a headless Chrome. If a property {@code test.use
 * .hub} is set to true, {@code AbstractViewTest} will assume that the TestBench
 * test is running in a CI environment. In order to keep the this class light,
 * it makes certain assumptions about the CI environment (such as available
 * environment variables). It is not advisable to use this class as a base class
 * for you own TestBench tests.
 * <p>
 * To learn more about TestBench, visit <a href=
 * "https://vaadin.com/docs/v10/testbench/testbench-overview.html">Vaadin
 * TestBench</a>.
 */
public abstract class AbstractViewTest extends TestBenchTestCase {
    private static final int SERVER_PORT = 8080;

    private final String route;

    @Rule
    public ScreenshotOnFailureRule rule = new ScreenshotOnFailureRule(this,
            true);

    @BeforeClass
    public static void setupClass() {
        WebDriverManager.chromedriver().setup();
    }

    public AbstractViewTest() {
        this("");
    }

    protected AbstractViewTest(String route) {
        this.route = route;
    }

    @Before
    public void setup() throws Exception {
        ChromeOptions options = new ChromeOptions();
        // options.setHeadless(true);
        setDriver(TestBench.createDriver(new ChromeDriver(options)));
        getDriver().get(getURL(route));

        testBench().resizeViewPortTo(1600, 900);

        // Wait for frontend compilation complete before testing
        waitForDevServer();
    }

    public void blur() {
        executeScript(
                "!!document.activeElement ? document.activeElement.blur() : 0");
    }

    public void login(String user, String pass) {
        var loginForm = $(LoginFormElement.class).first();
        loginForm.getUsernameField().setValue(user);
        loginForm.getPasswordField().setValue(pass);
        blur();
        loginForm.getSubmitButton().click();
    }
 
    public void wait(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
        }
    }

    /**
     * Returns deployment host name concatenated with route.
     *
     * @return URL to route
     */
    private static String getURL(String route) {
        return String.format("http://%s:%d/%s", getDeploymentHostname(),
                SERVER_PORT, route);
    }

    /**
     * Property set to true when running on a test hub.
     */
    private static final String USE_HUB_PROPERTY = "test.use.hub";

    /**
     * Returns whether we are using a test hub. This means that the starter is
     * running tests in Vaadin's CI environment, and uses TestBench to connect
     * to the testing hub.
     *
     * @return whether we are using a test hub
     */
    private static boolean isUsingHub() {
        return Boolean.TRUE.toString()
                .equals(System.getProperty(USE_HUB_PROPERTY));
    }

    /**
     * If running on CI, get the host name from environment variable HOSTNAME
     *
     * @return the host name
     */
    private static String getDeploymentHostname() {
        return isUsingHub() ? System.getenv("HOSTNAME") : "localhost";
    }

    protected void waitForDevServer() {
        Object result;
        do {
            getCommandExecutor().waitForVaadin();
            result = getCommandExecutor().executeScript(
                    "return window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.devServerIsNotLoaded;");
        } while (Boolean.TRUE.equals(result));
    }

    protected void waitForElementPresent(final By by) {
        waitUntil(ExpectedConditions.presenceOfElementLocated(by));
    }

    protected void scrollToElement(WebElement element) {
        Objects.requireNonNull(element,
                "The element to scroll to should not be null");
        getCommandExecutor().executeScript("arguments[0].scrollIntoView(true);",
                element);
    }
}
