describe('Registration Form Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(500);
  });

  it('Should print URL and Title, and take initial screenshot', () => {
    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
      console.log(`Current URL: ${url}`);
    });

    cy.title().then((title) => {
      cy.log(`Page Title: ${title}`);
      console.log(`Page Title: ${title}`);
    });

    cy.screenshot('00-initial-page');
  });

  it('Flow A: Should show error when Last Name is missing and highlight field', () => {
    cy.log('=== FLOW A: Missing Last Name Test ===');

    cy.get('#firstName').type('John');
    cy.get('#email').type('john.doe@example.com');
    cy.get('#phone').clear().type('+11234567890');
    cy.get('#gender').select('Male');
    cy.get('#password').type('StrongPass123!');
    cy.get('#confirmPassword').type('StrongPass123!');
    cy.get('#terms').check();

    cy.get('#submit-button').click();

    cy.get('#lastName').should('have.class', 'border-red-500');

    cy.contains('Last Name is required').should('be.visible');

    cy.get('#error-message').should('be.visible');
    cy.get('#error-message').should('contain', 'Please fix all errors');

    cy.screenshot('flow-a-error-state');

    cy.log('Flow A completed: Last Name error verified and screenshot captured');
  });

  it('Flow B: Should successfully submit form with all valid data', () => {
    cy.log('=== FLOW B: Successful Registration Test ===');

    cy.get('#firstName').type('Jane');
    cy.get('#lastName').type('Smith');
    cy.get('#email').type('jane.smith@example.com');
    cy.get('#phone').clear().type('+11234567890');
    cy.get('#age').type('28');
    cy.get('#gender').select('Female');
    cy.get('#address').type('123 Main Street, Apt 4B');

    cy.get('#country').select('United States');
    cy.wait(100);
    cy.get('#state').should('not.be.disabled');
    cy.get('#state').select('California');
    cy.wait(100);
    cy.get('#city').should('not.be.disabled');
    cy.get('#city').select('Los Angeles');

    cy.get('#password').type('SecurePass123!');
    cy.get('#confirmPassword').type('SecurePass123!');

    cy.get('#terms').check();

    cy.get('#submit-button').should('not.be.disabled');
    cy.get('#submit-button').click();

    cy.get('#success-message').should('be.visible');
    cy.get('#success-message').should('contain', 'Registration Successful!');
    cy.get('#success-message').should('contain', 'Your profile has been submitted successfully.');

    cy.screenshot('flow-b-success-state');

    cy.wait(3500);

    cy.get('#firstName').should('have.value', '');
    cy.get('#lastName').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#terms').should('not.be.checked');

    cy.log('Flow B completed: Successful registration verified and screenshot captured');
  });

  it('Flow C: Should verify dynamic dropdowns, password strength, and validation behaviors', () => {
    cy.log('=== FLOW C: Dynamic Behaviors Test ===');

    cy.log('Testing Country → State → City dropdowns...');
    cy.get('#state').should('be.disabled');
    cy.get('#city').should('be.disabled');

    cy.get('#country').select('United Kingdom');
    cy.wait(100);
    cy.get('#state').should('not.be.disabled');
    cy.get('#city').should('be.disabled');

    cy.get('#state').select('England');
    cy.wait(100);
    cy.get('#city').should('not.be.disabled');

    cy.get('#city').find('option').should('have.length.greaterThan', 1);

    cy.get('#country').select('Canada');
    cy.wait(100);
    cy.get('#state').should('have.value', '');
    cy.get('#city').should('have.value', '');
    cy.get('#city').should('be.disabled');

    cy.screenshot('flow-c-country-state-city');

    cy.log('Testing password strength indicator...');
    cy.get('#password').type('weak');
    cy.get('#password-strength').should('contain', 'Weak');

    cy.get('#password').clear().type('Medium123');
    cy.get('#password-strength').should('contain', 'Medium');

    cy.get('#password').clear().type('Strong123!@#');
    cy.get('#password-strength').should('contain', 'Strong');

    cy.screenshot('flow-c-password-strength');

    cy.log('Testing confirm password mismatch...');
    cy.get('#confirmPassword').type('DifferentPassword');
    cy.get('#confirmPassword').blur();
    cy.wait(100);

    cy.contains('Passwords do not match').should('be.visible');
    cy.get('#confirmPassword').should('have.class', 'border-red-500');

    cy.screenshot('flow-c-password-mismatch');

    cy.log('Testing submit button disabled state...');
    cy.get('#submit-button').should('be.disabled');

    cy.get('#firstName').type('Test');
    cy.get('#lastName').type('User');
    cy.get('#email').type('test@example.com');
    cy.get('#phone').clear().type('+11234567890');
    cy.get('#gender').select('Other');

    cy.get('#submit-button').should('be.disabled');

    cy.get('#confirmPassword').clear().type('Strong123!@#');

    cy.get('#submit-button').should('be.disabled');

    cy.get('#terms').check();

    cy.get('#submit-button').should('not.be.disabled');

    cy.screenshot('flow-c-submit-enabled');

    cy.log('Flow C completed: All dynamic behaviors verified');
  });

  it('Should verify phone validation with country code', () => {
    cy.get('#country').select('United Kingdom');
    cy.wait(100);

    cy.get('#phone').should('have.value', '+44');

    cy.get('#phone').clear().type('+44123456789');
    cy.get('#phone').blur();

    cy.get('#phone').should('not.have.class', 'border-red-500');

    cy.get('#country').select('India');
    cy.wait(100);
    cy.get('#phone').should('have.value', '+91');

    cy.screenshot('phone-country-code-validation');
  });

  it('Should verify disposable email blocking', () => {
    cy.get('#email').type('test@tempmail.com');
    cy.get('#email').blur();

    cy.contains('Disposable email addresses are not allowed').should('be.visible');
    cy.get('#email').should('have.class', 'border-red-500');

    cy.screenshot('disposable-email-blocked');
  });

  it('Should verify required field validations', () => {
    cy.get('#firstName').focus().blur();
    cy.contains('First Name is required').should('be.visible');

    cy.get('#email').focus().blur();
    cy.contains('Email is required').should('be.visible');

    cy.get('#phone').focus().blur();
    cy.contains('Phone number is required').should('be.visible');

    cy.get('#gender').focus().blur();
    cy.contains('Gender is required').should('be.visible');

    cy.screenshot('required-field-validations');
  });
});
