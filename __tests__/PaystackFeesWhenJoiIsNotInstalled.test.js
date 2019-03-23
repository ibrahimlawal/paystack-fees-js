jest.mock('joi');

describe('PaystackFees', () => {
    test('should not load if jest could not be loaded', () => {
        expect(() => {
            // eslint-disable-next-line global-require
            require('../PaystackFees');
        }).toThrow('not installed');
    });
});
