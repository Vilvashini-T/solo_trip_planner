/**
 * Simple validation for itinerary generation requests
 */
exports.validateGenerateRequest = (data) => {
    const { destination, days, interests, budget } = data;
    const errors = [];

    if (!destination || typeof destination !== 'string') {
        errors.push('Destination is required and must be a string');
    }

    if (!days || typeof days !== 'number' || days < 1 || days > 30) {
        errors.push('Days must be a number between 1 and 30');
    }

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
        errors.push('At least one interest is required');
    }

    if (!budget || typeof budget !== 'number' || budget <= 0) {
        errors.push('Budget must be a positive number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
