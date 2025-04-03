# Santander technical test

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5. The purpose of this project is to create a technical test for Scallian and Santander Bank.

## Previous Considerations

Although my goal in this test is to apply for a front-end developer position, I connected a free backend service with a PostgreSQL database. The service used is [Supabase](https://supabase.com/). I didn’t develop any server-side code except for the connection to storage and the database.

## Setup

To run this project, clone the repository to your local machine and execute the following commands:

```bash
npm i
npm run serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

You can launch `npm run serve -o` instead of `npm run serve` and let the browser open alone.

## About the architecture

Although I used Angular Zoneless (you can check `app.config.ts`) with standalone components, I followed a modular architecture that I learned from developers like Fernando Herrera. This architecture might be a bit verbose, but it allows for scalable implementations while encapsulating functionality effectively.

Each module contains all the necessary code for its specific functionality, including interfaces, components, composables, services, and any additional dependencies.

When working with aliases (which might seem a bit forced here), you can rename paths using a pattern like "module-xxx". This allows you to reference services such as createCandidate using an alias like "`@createCandidateService/*`", making paths shorter and improving readability.

It may seem overly expanded, but I designed it this way to ensure that the app can be easily scaled in the future. Currently, we are working with simple Excel files, but they might evolve and integrate with tools like `Power BI`.

## Areas for Improvement

- Security - Some keys are hardcoded. The best approach would be to use authenticated users in Supabase and proper authentication mechanisms. I didn’t implement this correctly because it was an additional feature beyond the test scope, and I didn’t want to spend more time on it than planned.

- Testing – I wrote some tests, but I didn’t test the service layer. I need to read more about testing in Supabase to properly mock it.

- Karma & Mocha – I used these tools because they are integrated with Angular and I’m familiar with them. However, given the new paradigm in Angular, switching to Jest would be a better approach.

- More Encapsulation – I want to further encapsulate components like inputs, but I didn’t do it yet because I want to implement them correctly. I’ve learned the hard way that poorly planned components can become too rigid, especially when working with forms.
