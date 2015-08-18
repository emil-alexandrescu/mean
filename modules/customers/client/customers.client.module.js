'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('customers', ['core']);
ApplicationConfiguration.registerModule('customers.address', ['core']);
ApplicationConfiguration.registerModule('customers.contact_info', ['core']);