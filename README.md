# Custom project from start.vaadin.com

This project was created from https://start.vaadin.com. It's a fully working Vaadin application that you continue developing locally.
It has all the necessary dependencies and files to help you get going.

The project is a standard Maven project, so you can import it to your IDE of choice. You'll need to have Java 11/17 + and Node.js 16.14+ installed.

To run from the command line, use `mvn` and open [http://localhost:8080](http://localhost:8080) in your browser.

## This application is demoing various aspects of Hilla framework

- Lazy loading data from server
- Using server side filterign of data
- Securing statelss Hilla app using Spring Security
- Demonstrating role based authorities, method level end point security
- Styling using Lumo utility classes
- Handling url parameters of the route
- Navigating with url parameters within the application
- Using renderer function in vaadin-grid
- Creating responsive vaadin-grid using ResizeObserver etc.
- Responsive CSS using media queries
- Setting tooltip formatter using additionalOptions for vaadin-charts
- Using Lumo Badge
- Using custom validator in binder
- Theming with Lumo CSS custom properties
- Date input in multiple formats
- Localization / views
- Localization of the DatePicker
- Localization of the binder error messages using its interpolator callback
- Example of vaadin-confirm-dialog
- Using static resources from serves (see the flags in language-switch)
- Using renderer with vaadin-select (see language-switch)
- Example of class name generator with vaadin-grid

## Before running

Create file "config/secrets/application.properties"

use this command to generate new random secret for your app:

openssl rand -base64 32

Copy the <secret key> to property in application.properties file

com.example.application.app.secret=<secret key>

## Running the app

Use:

mvn spring-boot:run

## Project structure

| Directory                                  | Description                                                                                                                 |
| :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `frontend/`                                | Client-side source directory                                                                                                |
| &nbsp;&nbsp;&nbsp;&nbsp;`index.html`       | HTML template                                                                                                 |
| &nbsp;&nbsp;&nbsp;&nbsp;`index.ts`         | Frontend entrypoint, contains the client-side routing setup using [Vaadin Router](https://vaadin.com/router)                |
| &nbsp;&nbsp;&nbsp;&nbsp;`main-layout.ts`   | Main layout Web Component, contains the navigation menu, uses [App Layout](https://vaadin.com/components/vaadin-app-layout) |
| &nbsp;&nbsp;&nbsp;&nbsp;`views/`           | UI views Web Components (TypeScript)                                                                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;`stores/`          | Stores, the business logic (TypeScript)                                                                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;`util/`            | Custom validator and Localization (TypeScript)                                                                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;`styles/`          | Styles directory (CSS)                                                                                               |
| `src/`                                     | Server-side source directory                                                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;`Application.java` | Server entrypoint                                                                                          |
| &nbsp;&nbsp;&nbsp;&nbsp; `data/`            | Entities and endpoints directory (Java)                                                                                              |

## What next?

[vaadin.com](https://vaadin.com) has lots of material to help you get you started:

- Read the [Quick Start Guide](https://vaadin.com/docs/v16/flow/typescript/quick-start-guide.html) to learn the first steps of full stack Vaadin applications development.
- Follow the tutorials in [vaadin.com/learn/tutorials](https://vaadin.com/learn/tutorials). Especially [Building Modern Web Apps with Spring Boot and Vaadin](https://vaadin.com/learn/tutorials/modern-web-apps-with-spring-boot-and-vaadin) is good for getting a grasp of the basic Vaadin concepts.
- Read the documentation in [vaadin.com/docs](https://vaadin.com/docs).
- For a bigger Vaadin application example, check out the Full Stack App starter from [vaadin.com/start](https://vaadin.com/start).
